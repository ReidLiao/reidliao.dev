/**
 * Sanity CDN (cdn.sanity.io / GCP) is often slow from mainland China.
 * Rewrite to same-origin `/api/img` so browsers hit the VPS (fast path + cache),
 * while the server fetches Sanity once and caches aggressively.
 */

const SANITY_CDN_HOST = 'cdn.sanity.io'

export type SanityImageOptions = {
  /** Max width hint for Sanity image pipeline */
  width?: number
  quality?: number
  /** Skip proxy (e.g. Open Graph / RSS need absolute CDN URLs) */
  absolute?: boolean
}

function withSanityParams(url: string, options: SanityImageOptions = {}) {
  const parsed = new URL(url)
  if (parsed.hostname !== SANITY_CDN_HOST) return url

  const { width, quality = 75 } = options
  if (width && width > 0) {
    parsed.searchParams.set('w', String(Math.round(width)))
  }
  if (!parsed.searchParams.has('auto')) {
    parsed.searchParams.set('auto', 'format')
  }
  if (!parsed.searchParams.has('q')) {
    parsed.searchParams.set('q', String(quality))
  }
  return parsed.toString()
}

/** Browser-facing src: proxied + compressed for Sanity assets. */
export function cdnImageSrc(
  url: string | null | undefined,
  options: SanityImageOptions = {}
): string {
  if (!url) return ''

  try {
    const optimized = withSanityParams(url, options)
    if (options.absolute) return optimized

    const parsed = new URL(optimized)
    if (parsed.hostname !== SANITY_CDN_HOST) return optimized

    return `/api/img?u=${encodeURIComponent(optimized)}`
  } catch {
    return url
  }
}

export function isAllowedImageProxyUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname === SANITY_CDN_HOST
  } catch {
    return false
  }
}
