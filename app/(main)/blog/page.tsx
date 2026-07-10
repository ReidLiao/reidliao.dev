import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'
import {
  getBlogCategories,
  getBlogPostsCount,
} from '~/sanity/queries'

import { BlogPosts } from './BlogPosts'

const PAGE_SIZE = 12

const description =
  '记录折腾日常，传递技术干货。这里聚焦现代全栈架构与系统运维实战，同时收录高效的软件工具推荐、优质云服务评测，以及那些填坑与创造路上的真实心得。'

export const metadata = {
  title: '我的博客',
  description,
  openGraph: {
    title: '我的博客',
    description,
  },
  twitter: {
    title: '我的博客',
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

function buildBlogHref({
  page,
  category,
}: {
  page?: number
  category?: string
}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const category = searchParams.category?.trim() || undefined
  const page = Math.max(1, Number(searchParams.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [categories, total] = await Promise.all([
    getBlogCategories(),
    getBlogPostsCount({ category }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const safeOffset = (currentPage - 1) * PAGE_SIZE

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          欢迎光临我的博客
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>
            记录折腾日常，传递
            <Highlight>技术干货</Highlight>
            。这里聚焦
            <Highlight>现代全栈架构</Highlight>
            与
            <Highlight>系统运维实战</Highlight>
            ，同时收录高效的软件工具推荐、优质云服务评测，以及那些填坑与创造路上的真实心得。
          </Balancer>
        </p>
        <p className="flex items-center">
          <SocialLink href="/feed.xml" platform="rss" />
        </p>
      </header>

      {categories && categories.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href={buildBlogHref({})}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !category
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            全部
          </Link>
          {categories.filter(Boolean).map((item) => (
            <Link
              key={item}
              href={buildBlogHref({ category: item })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                category === item
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">
        <BlogPosts
          limit={PAGE_SIZE}
          offset={safeOffset}
          category={category}
        />
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-12 flex items-center justify-center gap-3 text-sm"
          aria-label="博客分页"
        >
          {currentPage > 1 ? (
            <Link
              href={buildBlogHref({ page: currentPage - 1, category })}
              className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            >
              上一页
            </Link>
          ) : (
            <span className="rounded-full border border-transparent px-4 py-2 text-zinc-300 dark:text-zinc-600">
              上一页
            </span>
          )}
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={buildBlogHref({ page: currentPage + 1, category })}
              className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
            >
              下一页
            </Link>
          ) : (
            <span className="rounded-full border border-transparent px-4 py-2 text-zinc-300 dark:text-zinc-600">
              下一页
            </span>
          )}
        </nav>
      ) : null}
    </Container>
  )
}

export const revalidate = 60
