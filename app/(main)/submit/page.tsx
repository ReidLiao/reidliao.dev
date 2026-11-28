import { type Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '~/components/BreadcrumbJsonLd'
import { Container } from '~/components/ui/Container'
import { url } from '~/lib'
import { pageMetadata } from '~/lib/page-metadata'

import { SubmitRecommendationForm } from './SubmitRecommendationForm'

export const metadata = {
  title: '投稿推荐',
  description:
    '推荐你亲自用过的软件或资源。我会先体验和核实，通常在 7 个工作日内处理；合适的内容可能写成文章或收录进机房页。邮箱仅用于核实或通知，不会公开。',
  ...pageMetadata('/submit'),
  openGraph: {
    ...pageMetadata('/submit').openGraph,
    title: '投稿推荐',
    description:
      '推荐你亲自用过的软件或资源。我会先体验和核实，通常在 7 个工作日内处理；合适的内容可能写成文章或收录进机房页。邮箱仅用于核实或通知，不会公开。',
    images: [{ url: url('/submit/opengraph-image.png').href }],
  },
  twitter: {
    title: '投稿推荐',
    description:
      '推荐你亲自用过的软件或资源。我会先体验和核实，通常在 7 个工作日内处理；合适的内容可能写成文章或收录进机房页。邮箱仅用于核实或通知，不会公开。',
    card: 'summary_large_image',
    images: [url('/submit/twitter-image.png').href],
  },
} satisfies Metadata

export default function SubmitPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: '投稿推荐', path: '/submit' },
        ]}
      />
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">投稿推荐</h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          推荐你实际用过的软件或资源，我会先体验和核实，再决定是否收录。
        </p>
      </header>
      <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <SubmitRecommendationForm />
        </div>
        <aside className="space-y-4" aria-label="投稿说明与联系信息">
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-xs shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              投稿规则与处理
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              只推荐你实际用过的软件或资源；软件免费优先，资源只收录正版、自制或明确公开授权的；链接请优先给官网。
            </p>
            <p className="mt-3 border-t border-zinc-200 pt-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              <span className="font-medium text-zinc-800 dark:text-zinc-200">处理流程：</span>{' '}
              提交后我会先体验和核实，通常在 7 个工作日内处理；合适的会写成文章或收录进机房页，不合适的就不收录。
            </p>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-xs shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">隐私与联系</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">昵称用于必要的署名；邮箱为选填，仅用于核实信息或通知，不会公开。推荐内容可能经编辑后署名收录。</p>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <a
                href="mailto:hi@reidliao.dev"
                className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                hi@reidliao.dev
              </a>
              <Link
                href="/guestbook"
                className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                留言墙
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </Container>
  )
}
