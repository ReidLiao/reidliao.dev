import dns from 'node:dns/promises'
import { BlockList, isIP } from 'node:net'

import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env.mjs'
import { ratelimit } from '~/lib/redis'

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024
const FETCH_TIMEOUT_MS = 5000
const MAX_REDIRECTS = 5

export const runtime = 'nodejs'

const blockedNetworks = new BlockList()
for (const [address, prefix, type] of [
  ['0.0.0.0', 8, 'ipv4'],
  ['10.0.0.0', 8, 'ipv4'],
  ['100.64.0.0', 10, 'ipv4'],
  ['127.0.0.0', 8, 'ipv4'],
  ['169.254.0.0', 16, 'ipv4'],
  ['172.16.0.0', 12, 'ipv4'],
  ['192.168.0.0', 16, 'ipv4'],
  ['::', 128, 'ipv6'],
  ['::1', 128, 'ipv6'],
  ['fc00::', 7, 'ipv6'],
  ['fe80::', 10, 'ipv6'],
  ['ff00::', 8, 'ipv6'],
] as const) {
  blockedNetworks.addSubnet(address, prefix, type)
}

function isBlockedAddress(address: string): boolean {
  const version = isIP(address)
  if (version === 0 || blockedNetworks.check(address)) return true

  const mappedIPv4 = address.toLowerCase().match(/^::ffff:(.+)$/)?.[1]
  if (!mappedIPv4) return false
  if (isIP(mappedIPv4) === 4) return blockedNetworks.check(mappedIPv4)

  const mappedHex = mappedIPv4.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (!mappedHex) return false
  const high = Number.parseInt(mappedHex[1], 16)
  const low = Number.parseInt(mappedHex[2], 16)
  return blockedNetworks.check(
    `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`
  )
}

async function validatePublicUrl(rawUrl: string): Promise<URL> {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  if (
    !['http:', 'https:'].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error('Invalid URL')
  }

  const addresses = await dns.lookup(parsed.hostname, { all: true })
  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isBlockedAddress(address))
  ) {
    throw new Error('Private URL')
  }

  return parsed
}

async function readBodyLimited(response: Response): Promise<Buffer> {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    throw new Error('Response too large')
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
      if (total > MAX_RESPONSE_BYTES) {
        await reader.cancel()
        throw new Error('Response too large')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return Buffer.concat(chunks)
}

async function fetchSafe(
  rawUrl: string,
  accept: RegExp
): Promise<{ body: Buffer; contentType: string }> {
  let url = await validatePublicUrl(rawUrl)

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetch(url, {
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: accept.source },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location || redirects === MAX_REDIRECTS) {
        throw new Error('Too many redirects')
      }
      url = await validatePublicUrl(new URL(location, url).href)
      continue
    }

    const contentType = response.headers
      .get('content-type')
      ?.split(';')[0]
      .trim()
    if (!response.ok || !contentType || !accept.test(contentType)) {
      throw new Error('Invalid response')
    }

    return {
      body: await readBodyLimited(response),
      contentType,
    }
  }

  throw new Error('Too many redirects')
}

function errorResponse(message: string, status: 400 | 429 | 502 | 503) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}

export async function GET(req: NextRequest) {
  const rawUrl = new URL(req.url).searchParams.get('url')
  if (!rawUrl) return errorResponse('Invalid URL', 400)
  if (!env.LINK_PREVIEW_API_BASE_URL) {
    return errorResponse('Link preview is unavailable', 503)
  }

  const { success } = await ratelimit.limit('link-preview_', req)
  if (!success) return errorResponse('Too many requests', 429)

  try {
    const targetUrl = await validatePublicUrl(rawUrl)
    const previewBaseUrl = await validatePublicUrl(
      env.LINK_PREVIEW_API_BASE_URL
    )
    const previewUrl = new URL(
      'jpeg',
      `${previewBaseUrl.href.replace(/\/$/, '')}/`
    )
    previewUrl.searchParams.set('url', targetUrl.href)
    previewUrl.searchParams.set('width', '1200')
    previewUrl.searchParams.set('height', '750')
    // Keep any upstream preview cache short; this route never caches failures.
    previewUrl.searchParams.set('ttl', '300')

    const { body, contentType } = await fetchSafe(
      previewUrl.href,
      /^image\//i
    )

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Length': String(body.byteLength),
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return errorResponse('Link preview failed', 502)
  }
}
