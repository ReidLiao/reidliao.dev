import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { normalizeImageProxyUrl } from '~/lib/cdn-image'

const CACHE_DIR =
  process.env.IMAGE_CACHE_DIR || path.join(process.cwd(), '.cache', 'img')
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export class ImageProxyError extends Error {
  constructor(
    message: string,
    public readonly status: 413 | 415
  ) {
    super(message)
  }
}

function normalizedUrl(url: string): string | null {
  return normalizeImageProxyUrl(url)
}

function imageContentType(response: Response): string {
  const contentType = response.headers.get('content-type')?.split(';')[0].trim()
  if (!contentType?.startsWith('image/')) {
    throw new ImageProxyError('Unsupported image type', 415)
  }
  return contentType
}

async function readLimitedBody(response: Response): Promise<Buffer> {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    throw new ImageProxyError('Image is too large', 413)
  }

  if (!response.body) return Buffer.alloc(0)

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_IMAGE_BYTES) {
        await reader.cancel()
        throw new ImageProxyError('Image is too large', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks)
}

function cacheKey(url: string) {
  return createHash('sha256').update(url).digest('hex')
}

function pathsFor(url: string) {
  const key = cacheKey(url)
  return {
    file: path.join(CACHE_DIR, key),
    meta: path.join(CACHE_DIR, `${key}.meta`),
  }
}

export async function ensureImageCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true })
}

export async function readImageCache(url: string): Promise<{
  body: Buffer
  contentType: string
} | null> {
  const normalized = normalizedUrl(url)
  if (!normalized) return null

  const { file, meta } = pathsFor(normalized)
  try {
    const [body, contentType] = await Promise.all([
      fs.readFile(file),
      fs.readFile(meta, 'utf8'),
    ])
    const normalizedContentType = contentType.trim().split(';')[0]
    if (
      body.byteLength > MAX_IMAGE_BYTES ||
      !normalizedContentType.startsWith('image/')
    ) {
      return null
    }
    return { body, contentType: normalizedContentType }
  } catch {
    return null
  }
}

export async function writeImageCache(
  url: string,
  body: Buffer,
  contentType: string
) {
  const normalized = normalizedUrl(url)
  if (
    !normalized ||
    body.byteLength > MAX_IMAGE_BYTES ||
    !contentType.startsWith('image/')
  ) {
    return
  }

  await ensureImageCacheDir()
  const { file, meta } = pathsFor(normalized)
  await Promise.all([
    fs.writeFile(file, body),
    fs.writeFile(meta, contentType || 'image/jpeg', 'utf8'),
  ])
}

/** Fetch from Sanity (or return disk hit) and persist for next cold start. */
export async function fetchAndCacheImage(url: string): Promise<{
  body: Buffer
  contentType: string
} | null> {
  const normalized = normalizedUrl(url)
  if (!normalized) return null

  const cached = await readImageCache(normalized)
  if (cached) return cached

  const upstream = await fetch(normalized, {
    // The proxy is intentionally restricted to the Sanity CDN; do not follow
    // a redirect to another host.
    redirect: 'error',
    headers: {
      Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
    },
    // Avoid Next Data Cache for binary blobs; we own disk cache.
    cache: 'no-store',
  })

  if (!upstream.ok) return null

  const contentType = imageContentType(upstream)
  const body = await readLimitedBody(upstream)
  await writeImageCache(normalized, body, contentType)
  return { body, contentType }
}
