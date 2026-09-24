/**
 * Sanity CDN (cdn.sanity.io / GCP) is often slow from mainland China.
 * Rewrite to same-origin `/api/img` so browsers hit the VPS (fast path + cache),
 * while the server fetches Sanity once and caches aggressively.
 */

const SANITY_CDN_HOST = 'cdn.sanity.io'

// Only keep parameters supported by the Sanity image API. Apart from making
// cache keys stable, this prevents arbitrary query parameters from creating
// unboundedly many entries for the same asset.
const SANITY_IMAGE_PARAMS = new Set([
  'auto',
  'bg',
  'blur',
  'crop',
  'dpr',
  'dl',
  'fit',
  'fm',
  'fp-x',
  'fp-y',
  'fp-z',
  'h',
  'max-h',
  'max-w',
  'min-h',
  'min-w',
  'orientation',
  'q',
  'rect',
  'sat',
  'sharpen',
  'txt',
  'txt-align',
  'txt-color',
  'txt-fit',
  'txt-font',
  'txt-grow',
  'txt-pad',
  'txt-size',
  'txt-width',
  'w',
])

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

/** Return one stable URL for equivalent Sanity image requests. */
export function normalizeImageProxyUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== SANITY_CDN_HOST ||
      parsed.username ||
      parsed.password
    ) {
      return null
    }

    parsed.hash = ''
    const params = [...parsed.searchParams.entries()]
      .filter(([key]) => SANITY_IMAGE_PARAMS.has(key))
      .map(([key, value]) => [key, value] as const)
      .sort(([keyA, valueA], [keyB, valueB]) =>
        keyA === keyB
          ? valueA.localeCompare(valueB)
          : keyA.localeCompare(keyB)
      )

    parsed.search = ''
    for (const [key, value] of params) {
      parsed.searchParams.append(key, value)
    }

    return parsed.toString()
  } catch {
    return null
  }
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
  return normalizeImageProxyUrl(url) !== null
}
