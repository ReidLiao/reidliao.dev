import { kvKeys } from '~/config/kv'
import { isProduction } from '~/lib/is-production'
import { redis } from '~/lib/redis'
import { getLatestBlogPosts } from '~/sanity/queries'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({
  limit = 5,
  category,
}: {
  limit?: number
  category?: string
}) {
  const posts =
    (await getLatestBlogPosts({ limit, forDisplay: true, category })) || []
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  if (!isProduction) {
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else if (postIdKeys.length > 0) {
    views = await redis.mget<number[]>(...postIdKeys)
  }

  if (posts.length === 0) {
    return (
      <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 px-6 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700/60 dark:text-zinc-400">
        该分类暂无内容，敬请期待。
      </div>
    )
  }

  return (
    <>
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
