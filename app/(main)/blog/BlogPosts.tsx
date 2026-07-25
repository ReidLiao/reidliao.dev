import { kvKeys } from '~/config/kv'
import { isProduction } from '~/lib/is-production'
import { redis } from '~/lib/redis'
import { getLatestBlogPosts } from '~/sanity/queries'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({ limit = 5 }: { limit?: number }) {
  const posts =
    (await getLatestBlogPosts({ limit, forDisplay: true })) || []
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  if (!isProduction) {
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else if (postIdKeys.length > 0) {
    views = await redis.mget<number[]>(...postIdKeys)
  }

  return (
    <>
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
