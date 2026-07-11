import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import { isAllowedImageProxyUrl } from '~/lib/cdn-image'

const CACHE_DIR =
  process.env.IMAGE_CACHE_DIR || path.join(process.cwd(), '.cache', 'img')

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
  if (!isAllowedImageProxyUrl(url)) return null

  const { file, meta } = pathsFor(url)
  try {
    const [body, contentType] = await Promise.all([
      fs.readFile(file),
      fs.readFile(meta, 'utf8'),
    ])
    return { body, contentType: contentType.trim() || 'image/jpeg' }
  } catch {
    return null
  }
}

export async function writeImageCache(
  url: string,
  body: Buffer,
  contentType: string
) {
  if (!isAllowedImageProxyUrl(url)) return

  await ensureImageCacheDir()
  const { file, meta } = pathsFor(url)
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
  if (!isAllowedImageProxyUrl(url)) return null

  const cached = await readImageCache(url)
  if (cached) return cached

  const upstream = await fetch(url, {
    headers: {
      Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
    },
    // Avoid Next Data Cache for binary blobs; we own disk cache.
    cache: 'no-store',
  })

  if (!upstream.ok) return null

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  const body = Buffer.from(await upstream.arrayBuffer())
  await writeImageCache(url, body, contentType)
  return { body, contentType }
}
