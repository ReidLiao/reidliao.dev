import Link from 'next/link'

import { Container } from '~/components/ui/Container'

import { SubmitRecommendationForm } from './SubmitRecommendationForm'

export const metadata = {
  title: '投稿推荐',
  description: '推荐你亲自用过的软件或资源。',
}

export default function SubmitPage() {
  return (
    <Container className="mt-16 sm:mt-24">
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
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              投稿须知
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              只推荐你实际用过的软件或资源；软件免费优先，资源只收录正版、自制或明确公开授权的；链接请优先给官网。
            </p>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              处理流程
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              提交后我会先体验和核实，合适的会写成文章或收录进机房页，不合适的就不收录了，不逐个回复。
            </p>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              直接找我
            </h2>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <a
                href="mailto:hi@reidliao.dev"
                className="transition hover:text-lime-700 dark:hover:text-lime-400"
              >
                hi@reidliao.dev
              </a>
              <Link
                href="/guestbook"
                className="transition hover:text-lime-700 dark:hover:text-lime-400"
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
