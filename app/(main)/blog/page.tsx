import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { JsonLd } from '~/components/JsonLd'
import { Container } from '~/components/ui/Container'
import { url } from '~/lib'
import { pageMetadata } from '~/lib/page-metadata'
import {
  getBlogCategoryCounts,
  getLatestBlogPosts,
  getPublishedBlogPostCount,
} from '~/sanity/queries'

import { BlogPosts } from './BlogPosts'
import { CategoryScrollFade } from './CategoryScrollFade'
import { RssCopyLink } from './RssCopyLink'

const description =
  '这里记录全栈建站、Docker 自建、系统运维与软件工具——只写自己踩过的坑和验证过的做法。不追流量密码，有 RSS 可订阅，更新也不定期。'

export const metadata = {
  title: '近期写作',
  description,
  alternates: pageMetadata('/blog').alternates,
  openGraph: {
    ...pageMetadata('/blog').openGraph,
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

export default async function BlogPage(
  props: {
    searchParams?: Promise<{ category?: string; page?: string }>
  }
) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category
  const parsedPage = Number(searchParams?.page)
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const [categoryCounts, total, allTotal, requestedPosts] = await Promise.all([
    getBlogCategoryCounts(),
    getPublishedBlogPostCount(category),
    category ? getPublishedBlogPostCount() : Promise.resolve(0),
    getLatestBlogPosts({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      categorySlug: category,
      forDisplay: true,
    }),
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
  const posts =
    safeTotal === 0
      ? []
      : currentPage === page
        ? requestedPosts
        : await getLatestBlogPosts({
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            categorySlug: safeCategory,
            forDisplay: true,
          })
  const orderedCategories = categoryOrder.flatMap((title) =>
    categoryCounts.filter((item) => item.title === title)
  )
  const tabs = [
    { title: '全部', slug: undefined, count: category ? allTotal : total },
    ...orderedCategories.map((item) => ({ ...item })),
  ]
  const collectionUrl = url(queryHref(safeCategory, currentPage)).href
  const breadcrumbItems = [
    { name: '首页', item: url('/').href },
    { name: '近期写作', item: url('/blog').href },
    ...(selectedCategory
      ? [{ name: selectedCategory.title, item: collectionUrl }]
      : []),
  ]

  return (
    <Container className="mt-16 sm:mt-24">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': `${collectionUrl}#collection`,
              url: collectionUrl,
              name: '近期写作',
              description,
              inLanguage: 'zh-CN',
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: posts?.length ?? 0,
                itemListElement: (posts ?? []).map((post, index) => ({
                  '@type': 'ListItem',
                  position: (currentPage - 1) * pageSize + index + 1,
                  url: url(`/blog/${post.slug}`).href,
                  name: post.title,
                })),
              },
              breadcrumb: { '@id': `${collectionUrl}#breadcrumb` },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${collectionUrl}#breadcrumb`,
              itemListElement: breadcrumbItems.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.item,
              })),
            },
          ],
        }}
      />
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
      <div className="mt-8 border-b-0 pb-2 dark:border-zinc-800 sm:border-b sm:pb-4">
        <div className="flex items-center gap-3">
          <CategoryScrollFade>
            <nav
              aria-label="文章分类"
              className="flex shrink-0 gap-2"
            >
              {tabs.map((tab) => {
                const active = (tab.slug ?? '') === (safeCategory ?? '')
                const empty = tab.count === 0
                return (
                  <Link
                    key={tab.slug ?? 'all'}
                    href={queryHref(tab.slug, 1)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900 ${active ? 'border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950' : empty ? 'border-zinc-200 text-zinc-400 hover:border-emerald-700 hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-emerald-400 dark:hover:text-zinc-300' : 'border-zinc-300 text-zinc-700 hover:border-emerald-700 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-400'}`}
                  >
                    {tab.title}
                    <span
                      className={
                        active
                          ? 'text-current'
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
          </CategoryScrollFade>
          <Link href="/submit" className="hidden h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-700 px-3 text-xs font-medium text-emerald-700 transition hover:bg-emerald-700/10 sm:inline-flex sm:px-4 sm:text-sm dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400/10">
            投稿推荐
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-2 sm:hidden">
          <Link href="/submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-emerald-700 px-4 text-sm font-medium text-emerald-700 transition hover:bg-emerald-700/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-400/10 dark:focus-visible:ring-emerald-400">
            投稿推荐
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts posts={posts ?? []} />
      </div>
      {safeTotal === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 px-5 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            这个分类暂时还没有文章，换个分类看看吧。
          </p>
          <Link
            href="/submit"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
          >
            去投稿推荐
          </Link>
        </div>
      ) : null}
      {totalPages > 1 ? (
        <nav aria-label="文章分页" className="mt-10 flex items-center justify-center gap-3">
          <Link aria-label="上一页" aria-disabled={currentPage <= 1} className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm after:absolute after:-inset-1.5 after:content-[''] ${currentPage <= 1 ? 'pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800' : 'border-zinc-300 text-zinc-700 hover:border-emerald-700 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400'}`} href={queryHref(safeCategory, Math.max(1, currentPage - 1))}>‹</Link>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === currentPage
            return <Link key={pageNumber} href={queryHref(safeCategory, pageNumber)} aria-current={active ? 'page' : undefined} className={`relative inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-sm font-medium transition after:absolute after:-inset-1.5 after:content-[''] ${active ? 'border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950' : 'border-zinc-300 text-zinc-700 hover:border-emerald-700 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-400'}`}>{pageNumber}</Link>
          })}
          <Link aria-label="下一页" aria-disabled={currentPage >= totalPages} className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm after:absolute after:-inset-1.5 after:content-[''] ${currentPage >= totalPages ? 'pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800' : 'border-zinc-300 text-zinc-700 hover:border-emerald-700 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-400'}`} href={queryHref(safeCategory, Math.min(totalPages, currentPage + 1))}>›</Link>
        </nav>
      ) : null}
    </Container>
  )
}

// 静态缓存 10 分钟；发布/更新走 Sanity Webhook → /api/revalidate 即时刷新。
export const revalidate = 600
