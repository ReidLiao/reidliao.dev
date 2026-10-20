import { PencilSwooshIcon } from '~/assets'
import { kvKeys } from '~/config/kv'
import { isProduction } from '~/lib/is-production'
import { redis } from '~/lib/redis'
import { getLatestBlogPosts } from '~/sanity/queries'
import { type Post } from '~/sanity/schemas/post'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({
  posts: inputPosts,
  limit = 5,
}: {
  posts?: Post[]
  limit?: number
}) {
  const posts = inputPosts ?? (await getLatestBlogPosts({ limit, forDisplay: true })) ?? []
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  if (!isProduction) {
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else if (postIdKeys.length > 0) {
    views = await redis.mget<number[]>(...postIdKeys)
  }

  if (posts.length === 0) {
    if (inputPosts !== undefined) return null
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-700/60">
        <PencilSwooshIcon className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          还没有文章，敬请期待。
        </p>
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
