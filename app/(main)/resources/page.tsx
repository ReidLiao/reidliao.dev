import { type Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '~/components/BreadcrumbJsonLd'
import { Badge } from '~/components/shadcn/badge'
import { Container } from '~/components/ui/Container'
import { url } from '~/lib'
import { pageMetadata } from '~/lib/page-metadata'
import { getResources } from '~/sanity/queries/resources'

const title = '资源'
const description = '整理可下载的软件与工具资源，下载链接由夸克网盘提供。'

export const metadata = {
  title,
  description,
  ...pageMetadata('/resources'),
  openGraph: {
    ...pageMetadata('/resources').openGraph,
    title,
    description,
    images: [{ url: url('/opengraph-image.png').href }],
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    images: [url('/twitter-image.png').href],
  },
} satisfies Metadata

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <Container className="mt-16 sm:mt-32">
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: title, path: '/resources' },
        ]}
      />
      <header className="max-w-2xl">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          /resources
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge>{resources.length} 项资源</Badge>
        <Badge variant="secondary">夸克网盘存放</Badge>
      </div>

      {resources.length ? (
        <ul className="mt-5 divide-y divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-700/40 dark:border-zinc-700/40">
          {resources.map((resource) => (
            <li
              key={resource._id}
              className="flex min-h-14 items-center gap-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {resource.name}
              </span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`下载${resource.name}（新窗口打开）`}
                className="inline-flex min-h-10 flex-none items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-emerald-700 hover:bg-emerald-700 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-zinc-950"
              >
                下载
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
          暂无收录资源。
        </p>
      )}

      <aside className="mt-8 border-t border-zinc-100 pt-5 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700/40 dark:text-zinc-400">
        资源通过夸克网盘分享，本站不托管文件。关于分发方式的说明，请查看
        <Link
          href="/about#download-strategy"
          className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-emerald-700 dark:text-zinc-200 dark:decoration-zinc-600 dark:hover:text-emerald-400"
        >
          下载策略
        </Link>
        。
      </aside>
    </Container>
  )
}

export const revalidate = 600
