import type { ImageLoaderProps } from 'next/image'

/**
 * Next.js custom image loader.
 *
 * Sanity CDN images already come through `cdnImageSrc()` as
 *   /api/img?u=<encoded https://cdn.sanity.io/...?w=X&q=Y>
 * so the browser hits our VPS (fast + disk-cached). We swap the `w` param
 * to whatever Next's srcSet asks for, so mobile devices actually get a
 * mobile-sized picture instead of the 1600 px cover.
 *
 * Any other src (local static, external avatars) is returned unchanged.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const proxyPrefix = '/api/img?u='
  if (!src.startsWith(proxyPrefix)) {
    return src
  }

  try {
    const encoded = src.slice(proxyPrefix.length)
    const upstream = new URL(decodeURIComponent(encoded))
    upstream.searchParams.set('w', String(Math.max(64, Math.round(width))))
    if (quality) {
      upstream.searchParams.set('q', String(quality))
    }
    if (!upstream.searchParams.has('auto')) {
      upstream.searchParams.set('auto', 'format')
    }
    return `${proxyPrefix}${encodeURIComponent(upstream.toString())}`
  } catch {
    return src
  }
}
