import { type MetadataRoute } from 'next'

import { url } from '~/lib'
import { postModifiedAt } from '~/lib/post-dates'
import { getBlogPostsForSitemap } from '~/sanity/queries'

export default async function sitemap() {
  const staticMap = [
    {
      url: url('/').href,
    },
    {
      url: url('/blog').href,
    },
    {
      url: url('/vps').href,
    },
    {
      url: url('/guestbook').href,
    },
    {
      url: url('/about').href,
    },
  ] satisfies MetadataRoute.Sitemap

  const posts = ((await getBlogPostsForSitemap()) || []).filter(
    // Draft documents are already excluded by the Sanity query. Keep the
    // known test article out of the public sitemap as well.
    (post) => post.slug !== 'test'
  )

  const dynamicMap = posts.map((post) => ({
    url: url(`/blog/${post.slug}`).href,
    lastModified: new Date(
      postModifiedAt(post.publishedAt, post.updatedAt)
    ),
  })) satisfies MetadataRoute.Sitemap

  return [...staticMap, ...dynamicMap]
}

export const runtime = 'nodejs'
export const revalidate = 60
