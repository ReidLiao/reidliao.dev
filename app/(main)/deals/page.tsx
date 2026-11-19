import type { Metadata } from 'next'
import Link from 'next/link'

import { Container } from '~/components/ui/Container'
import { pageMetadata } from '~/lib/page-metadata'
import { type Deal, getDeals } from '~/sanity/queries'

const title = '限时优惠'
const description = '阿里云、腾讯云与 DMIT 的限时优惠汇总。优惠内容和有效期以服务商页面为准。'

export const metadata = {
  title,
  description,
  ...pageMetadata('/deals'),
  openGraph: { ...pageMetadata('/deals').openGraph, title, description },
} satisfies Metadata

function daysRemaining(date: string) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
  const start = Date.parse(`${today}T00:00:00Z`)
  const end = Date.parse(`${date}T00:00:00Z`)
  return Math.ceil((end - start) / 86_400_000)
}

const providerName: Record<string, string> = { aliyun: '阿里云', tencent: '腾讯云', dmit: 'DMIT' }

export default async function DealsPage() {
  const deals: Deal[] = await getDeals().catch((error) => {
    console.error('[Sanity deals]', error)
    return []
  })

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">/deals</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">限时优惠</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">汇总限时活动与优惠入口。长期自用线路和选购记录请看 <a className="text-lime-700 underline decoration-lime-600/40 underline-offset-4 dark:text-lime-400" href="/vps">机房</a>。</p>
      </header>
      <section aria-label="其他入口" className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/vps" className="group rounded-2xl border border-zinc-200 bg-white/70 p-5 transition hover:border-lime-500/50 hover:bg-lime-500/5 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-lime-400/40 dark:hover:bg-lime-400/5">
          <span className="text-sm font-semibold text-zinc-900 group-hover:text-lime-800 dark:text-zinc-100 dark:group-hover:text-lime-300">选机器去机房页</span>
          <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">查看长期自用的 VPS 与线路。</span>
        </Link>
        <Link href="/donate" className="group rounded-2xl border border-zinc-200 bg-white/70 p-5 transition hover:border-lime-500/50 hover:bg-lime-500/5 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-lime-400/40 dark:hover:bg-lime-400/5">
          <span className="text-sm font-semibold text-zinc-900 group-hover:text-lime-800 dark:text-zinc-100 dark:group-hover:text-lime-300">支持本站去捐赠页</span>
          <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">了解本站开销与捐赠方式。</span>
        </Link>
      </section>
      {deals.length ? <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {deals.map((deal) => {
          const days = deal.validUntil ? daysRemaining(deal.validUntil) : null
          return <li key={deal._id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-lime-700/20 bg-lime-500/10 px-3 py-1 text-xs font-medium text-lime-800 dark:border-lime-400/20 dark:text-lime-300">{providerName[deal.provider] ?? deal.provider}</span>
              {deal.validUntil ? <time dateTime={deal.validUntil} className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{days !== null && days >= 0 ? `距 ${new Date(`${deal.validUntil}T00:00:00`).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' })} 还剩 ${days} 天` : '活动已到期'}</time> : null}
            </div>
            <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{deal.title}</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-lime-800 dark:text-lime-300">{deal.discount}</p>
            {deal.description ? <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{deal.description}</p> : null}
            <a href={deal.promotionUrl} target="_blank" rel="sponsored noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500">前往活动页<span className="sr-only">（新窗口）</span></a>
          </li>
        })}
      </ul> : <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">优惠正在整理中。</p>}
      <aside aria-label="推广链接披露" className="mt-12 max-w-2xl py-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">ⓘ 部分链接为推广链接：通过它们购买价格不变，我会获得一点佣金；其中部分还附带专属优惠。</aside>
    </Container>
  )
}
