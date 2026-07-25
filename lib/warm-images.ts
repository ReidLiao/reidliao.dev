import { cdnImageSrc } from '~/lib/cdn-image'
import { fetchAndCacheImage } from '~/lib/img-cache'
import { getLatestBlogPosts, getSettings } from '~/sanity/queries'

/**
 * Prefetch homepage / recent-post images into disk cache on boot,
 * so the first real visitor doesn't pay the Sanity round-trip.
 */
export async function warmCriticalImages() {
  try {
    const [settings, posts] = await Promise.all([
      getSettings(),
      getLatestBlogPosts({ limit: 6, forDisplay: true }),
    ])

    const urls = new Set<string>()

    for (const photo of settings?.heroPhotos ?? []) {
      if (!photo?.url) continue
      const src = cdnImageSrc(photo.url, {
        width: 720,
        quality: 75,
        absolute: true,
      })
      if (src) urls.add(src)
    }

    for (const post of posts ?? []) {
      const cover = post.mainImage?.asset?.url
      if (!cover) continue
      urls.add(cdnImageSrc(cover, { width: 840, quality: 75, absolute: true }))
      urls.add(cdnImageSrc(cover, { width: 1600, quality: 80, absolute: true }))
    }

    await Promise.allSettled(
      [...urls].map((url) => fetchAndCacheImage(url))
    )

    if (process.env.NODE_ENV === 'production') {
      console.info(`[img-cache] warmed ${urls.size} critical images`)
    }
  } catch (error) {
    console.warn('[img-cache] warm failed:', error)
  }
}
