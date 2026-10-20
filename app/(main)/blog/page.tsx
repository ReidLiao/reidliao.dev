import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { Container } from '~/components/ui/Container'
import {
  getBlogCategoryCounts,
  getLatestBlogPosts,
  getPublishedBlogPostCount,
} from '~/sanity/queries'

import { BlogPosts } from './BlogPosts'
import { RssCopyLink } from './RssCopyLink'

const description =
  '这里记录全栈建站、Docker 自建、系统运维与软件工具——只写自己踩过的坑和验证过的做法。不追流量密码，有 RSS 可订阅，更新也不定期。'

export const metadata = {
  title: '近期写作',
  description,
  openGraph: {
    title: '近期写作',
    description,
  },
  twitter: {
    title: '近期写作',
    description,
    card: 'summary_large_image',
  },
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
      {children}
    </span>
  )
}

const pageSize = 12
const categoryOrder = ['软件', '资源', '教程', '随笔']

function queryHref(category: string | undefined, page: number) {
  const query = new URLSearchParams()
  if (category) query.set('category', category)
  if (page > 1) query.set('page', String(page))
  const search = query.toString()
  return search ? `/blog?${search}` : '/blog'
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string; page?: string }
}) {
  const category = searchParams?.category
  const parsedPage = Number(searchParams?.page)
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const [categoryCounts, total, allTotal] = await Promise.all([
    getBlogCategoryCounts(),
    getPublishedBlogPostCount(category),
    category ? getPublishedBlogPostCount() : Promise.resolve(0),
  ])
  const selectedCategory = categoryCounts.find((item) => item.slug === category)
  const safeCategory = selectedCategory?.slug
  const safeTotal = selectedCategory === undefined && category ? 0 : total
  const totalPages = Math.max(1, Math.ceil(safeTotal / pageSize))
  const currentPage = Math.min(page, totalPages)
  const firstPageNumber = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => firstPageNumber + index
  )
  const posts = safeTotal > 0 ? await getLatestBlogPosts({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    categorySlug: safeCategory,
    forDisplay: true,
  }) : []
  const orderedCategories = categoryOrder.flatMap((title) =>
    categoryCounts.filter((item) => item.title === title)
  )
  const tabs = [
    { title: '全部', slug: undefined, count: category ? allTotal : total },
    ...orderedCategories.map((item) => ({ ...item })),
  ]

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          近期写作
        </h1>
        <p className="my-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Balancer>
            这里记录
            <Highlight>全栈建站</Highlight>、
            <Highlight>Docker 自建</Highlight>、
            <Highlight>系统运维</Highlight>
            与软件工具——只写自己踩过的坑和验证过的做法。不追流量密码，有
            RSS 可订阅，更新也不定期。
          </Balancer>
        </p>
        <RssCopyLink />
      </header>
      <div className="mt-8 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative min-w-0 flex-1 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-7 after:bg-gradient-to-l after:from-zinc-50 after:to-transparent dark:after:from-primary-900 sm:after:hidden">
            <nav
              aria-label="文章分类"
              className="flex min-w-0 gap-2 overflow-x-auto py-1 pr-8"
            >
              {tabs.map((tab) => {
                const active = (tab.slug ?? '') === (safeCategory ?? '')
                const empty = tab.count === 0
                return (
                  <Link
                    key={tab.slug ?? 'all'}
                    href={queryHref(tab.slug, 1)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 dark:focus-visible:ring-lime-400 dark:focus-visible:ring-offset-zinc-900 ${active ? 'border-lime-400 bg-lime-400 text-zinc-950' : empty ? 'border-zinc-200 text-zinc-400 hover:border-lime-500 hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-lime-400 dark:hover:text-zinc-300' : 'border-zinc-300 text-zinc-700 hover:border-lime-500 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400 dark:hover:text-lime-300'}`}
                  >
                    {tab.title}
                    <span
                      className={
                        active
                          ? 'text-zinc-950/70'
                          : empty
                            ? 'text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-500 dark:text-zinc-400'
                      }
                    >
                      {tab.count}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
          <Link href="/submit" className="hidden h-9 shrink-0 items-center justify-center rounded-full border border-zinc-300 px-3 text-xs font-medium text-zinc-700 transition hover:border-lime-500 hover:text-lime-700 sm:inline-flex sm:px-4 sm:text-sm dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400 dark:hover:text-lime-300">
            投稿推荐
          </Link>
        </div>
        <div className="mt-3 flex justify-end sm:hidden">
          <Link href="/submit" className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition hover:border-lime-500 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400 dark:hover:text-lime-300">
            投稿推荐
          </Link>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts posts={posts ?? []} />
      </div>
      {safeTotal === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 px-5 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            这个分类暂时还没有文章，换个分类看看吧。
          </p>
          <Link
            href="/submit"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-lime-400 px-4 text-sm font-medium text-zinc-950 transition hover:bg-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 dark:focus-visible:ring-lime-400 dark:focus-visible:ring-offset-zinc-900"
          >
            去投稿推荐
          </Link>
        </div>
      ) : null}
      {totalPages > 1 ? (
        <nav aria-label="文章分页" className="mt-10 flex items-center justify-center gap-3">
          <Link aria-label="上一页" aria-disabled={currentPage <= 1} className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm after:absolute after:-inset-1.5 after:content-[''] ${currentPage <= 1 ? 'pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800' : 'border-zinc-300 text-zinc-700 hover:border-lime-500 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400'}`} href={queryHref(safeCategory, Math.max(1, currentPage - 1))}>‹</Link>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === currentPage
            return <Link key={pageNumber} href={queryHref(safeCategory, pageNumber)} aria-current={active ? 'page' : undefined} className={`relative inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-sm font-medium transition after:absolute after:-inset-1.5 after:content-[''] ${active ? 'border-lime-400 bg-lime-400 text-zinc-950' : 'border-zinc-300 text-zinc-700 hover:border-lime-500 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400 dark:hover:text-lime-300'}`}>{pageNumber}</Link>
          })}
          <Link aria-label="下一页" aria-disabled={currentPage >= totalPages} className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm after:absolute after:-inset-1.5 after:content-[''] ${currentPage >= totalPages ? 'pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800' : 'border-zinc-300 text-zinc-700 hover:border-lime-500 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400'}`} href={queryHref(safeCategory, Math.min(totalPages, currentPage + 1))}>›</Link>
        </nav>
      ) : null}
    </Container>
  )
}

// 静态缓存 10 分钟；发布/更新走 Sanity Webhook → /api/revalidate 即时刷新。
export const revalidate = 600
