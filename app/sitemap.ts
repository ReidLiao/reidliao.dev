import { type MetadataRoute } from 'next'

import { url } from '~/lib'
import { postModifiedAt } from '~/lib/post-dates'
import { getBlogPostsForSitemap } from '~/sanity/queries'

export default async function sitemap() {
  const staticMap = [
    {
      url: url('/').href,
      lastModified: new Date(),
    },
    {
      url: url('/blog').href,
      lastModified: new Date(),
    },
    {
      url: url('/vps').href,
      lastModified: new Date(),
    },
    {
      url: url('/guestbook').href,
      lastModified: new Date(),
    },
    {
      url: url('/about').href,
      lastModified: new Date(),
    },
  ] satisfies MetadataRoute.Sitemap

  const posts = (await getBlogPostsForSitemap()) || []

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
