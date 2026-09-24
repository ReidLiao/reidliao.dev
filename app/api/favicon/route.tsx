import dns from 'node:dns/promises'
import { BlockList, isIP } from 'node:net'

import * as cheerio from 'cheerio'
import { ImageResponse } from 'next/og'
import { type NextRequest, NextResponse } from 'next/server'

import { ratelimit, redis } from '~/lib/redis'

export const runtime = 'nodejs'
export const revalidate = 259200 // 3 days

function getKey(url: string) {
  return `favicon:${url}`
}

const faviconMapper: { [key: string]: string } = {
  '((?:zolplay.cn)|(?:zolplay.com)|(?:cn.zolplay.com))':
    'https://reidliao.dev/favicons/zolplay.png',
  '(?:github.com)': 'https://reidliao.dev/favicons/github.png',
  '((?:t.co)|(?:twitter.com)|(?:x.com))':
    'https://reidliao.dev/favicons/twitter.png',
  'coolshell.cn': 'https://reidliao.dev/favicons/coolshell.png',
  'vercel.com': 'https://reidliao.dev/favicons/vercel.png',
  'nextjs.org': 'https://reidliao.dev/favicons/nextjs.png',
}

function getPredefinedIconForUrl(url: string): string | undefined {
  for (const regexStr in faviconMapper) {
    const regex = new RegExp(
      `^(?:https?:\/\/)?(?:[^@/\\n]+@)?(?:www.)?` + regexStr
    )
    if (regex.test(url)) {
      return faviconMapper[regexStr]
    }
  }

  return undefined
}

const width = 32
const height = width

const MAX_RESPONSE_BYTES = 1024 * 1024
const FETCH_TIMEOUT_MS = 5000
const MAX_REDIRECTS = 5

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
  ['::ffff:0:0', 96, 'ipv6'],
  ['fc00::', 7, 'ipv6'],
  ['fe80::', 10, 'ipv6'],
  ['ff00::', 8, 'ipv6'],
] as const) {
  blockedNetworks.addSubnet(address, prefix, type)
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
    addresses.some(({ address }) => {
      const version = isIP(address)
      return version === 0 || blockedNetworks.check(address, version === 6 ? 'ipv6' : 'ipv4')
    })
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
      if (total > MAX_RESPONSE_BYTES) throw new Error('Response too large')
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
): Promise<{ response: Response; body: Buffer; url: URL }> {
  let url = await validatePublicUrl(rawUrl)

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: accept.source },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location || redirects === MAX_REDIRECTS) throw new Error('Too many redirects')
      url = await validatePublicUrl(new URL(location, url).href)
      continue
    }

    if (
      !response.ok ||
      !accept.test(
        response.headers.get('content-type')?.split(';')[0] ?? ''
      )
    ) {
      throw new Error('Invalid response')
    }

    return { response, body: await readBodyLimited(response), url }
  }

  throw new Error('Too many redirects')
}

function renderFavicon(url: string) {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={`${url} 的图标`} width={width} height={height} />
    ),
    {
      width,
      height,
    }
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawUrl = searchParams.get('url')

  if (!rawUrl) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const { success } = await ratelimit.limit('favicon' + `_${req.ip ?? ''}`)
  if (!success) {
    return NextResponse.error()
  }

  let iconUrl = 'https://reidliao.dev/favicon_blank.png'

  try {
    const pageUrl = await validatePublicUrl(rawUrl)
    const predefinedIcon = getPredefinedIconForUrl(pageUrl.href)
    if (predefinedIcon) {
      return renderFavicon(predefinedIcon)
    }

    const cachedFavicon = await redis.get<string>(getKey(pageUrl.href))
    if (cachedFavicon) {
      return renderFavicon(cachedFavicon)
    }

    const { body: html } = await fetchSafe(pageUrl.href, /^text\/html$/i)
    const $ = cheerio.load(html.toString('utf8'))
    const finalFavicon =
      $('link[rel="apple-touch-icon"]').attr('href') ??
      $('link[rel="icon"]').attr('href') ??
      $('link[rel="shortcut icon"]').attr('href')

    if (finalFavicon) {
      const faviconUrl = new URL(finalFavicon, pageUrl).href
      const { body, response } = await fetchSafe(faviconUrl, /^image\//i)
      const contentType =
        response.headers.get('content-type')?.split(';')[0] ?? 'image/png'
      iconUrl = `data:${contentType};base64,${body.toString('base64')}`
    }

    await redis.set(getKey(pageUrl.href), iconUrl, { ex: revalidate })

    return renderFavicon(iconUrl)
  } catch {
    return NextResponse.json({ error: 'Invalid favicon URL' }, { status: 400 })
  }
}
