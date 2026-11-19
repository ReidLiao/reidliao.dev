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

const providerGroups: { provider: Deal['provider']; title: string }[] = [
  { provider: 'aliyun', title: '阿里云' },
  { provider: 'tencent', title: '腾讯云' },
  { provider: 'dmit', title: 'DMIT' },
]

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
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">汇总阿里云、腾讯云与 DMIT 的限时优惠入口。</p>
      </header>
      {deals.length ? (
        <div className="mt-10 space-y-10">
          {providerGroups.map((group) => {
            const providerDeals = deals.filter((deal) => deal.provider === group.provider)
            if (!providerDeals.length) return null
            return (
              <section key={group.provider} aria-labelledby={`provider-${group.provider}`}>
                <h2 id={`provider-${group.provider}`} className="border-b border-zinc-200 pb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">{group.title}</h2>
                <ul className="mt-5 grid gap-5 md:grid-cols-2">
                  {providerDeals.map((deal) => {
                    const days = deal.validUntil ? daysRemaining(deal.validUntil) : null
                    return (
                      <li key={deal._id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
                        {deal.validUntil ? <time dateTime={deal.validUntil} className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{days !== null && days >= 0 ? `距 ${new Date(`${deal.validUntil}T00:00:00`).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' })} 还剩 ${days} 天` : '活动已到期'}</time> : null}
                        <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{deal.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-lime-800 dark:text-lime-300">{deal.discount}</p>
                        {deal.description ? <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{deal.description}</p> : null}
                        <a href={deal.promotionUrl} target="_blank" rel="sponsored noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500">前往活动页<span className="sr-only">（新窗口）</span></a>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      ) : <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">暂无可用优惠。</p>}
      <nav aria-label="其他站点入口" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-700/40">
        <Link href="/vps" className="text-zinc-600 transition hover:text-lime-700 dark:text-zinc-400 dark:hover:text-lime-400">选机器去机房页</Link>
        <Link href="/donate" className="text-zinc-600 transition hover:text-lime-700 dark:text-zinc-400 dark:hover:text-lime-400">支持本站去捐赠页</Link>
      </nav>
      <aside aria-label="推广链接披露" className="mt-8 max-w-2xl py-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">ⓘ 部分链接为推广链接：通过它们购买价格不变，我会获得一点佣金；其中部分还附带专属优惠。</aside>
    </Container>
  )
}
