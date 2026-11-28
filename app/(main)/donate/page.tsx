import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '~/components/BreadcrumbJsonLd'
import { Container } from '~/components/ui/Container'
import { url } from '~/lib'
import { pageMetadata } from '~/lib/page-metadata'
import { getDonors } from '~/sanity/queries'

import { DonationAddress } from './DonationAddress'

const title = '捐赠'
const description =
  '如果你愿意支持青柠夜栈，捐赠将用于支付本站 VPS 与域名续费，帮助这个独立维护的技术博客继续运行。页面提供支付宝、微信和加密货币等方式，金额随意。'

const donationAddresses = [
  {
    currency: 'USDT',
    network: 'TRC20',
    address: 'TVj8ydAj5JLRKjUs3nyWC84svjMqQoy7WE',
    note: '推荐',
  },
  {
    currency: 'ETH',
    network: 'ERC20 主网',
    address: '0x054911ff4dec92db06e55d4113782ad88c62d864',
  },
  {
    currency: 'BTC',
    network: '比特币主网',
    address: '18jrCHNPeYvpqksBQgVvB7ha7Ae8UM6RSi',
  },
] as const

export const metadata = {
  title,
  description,
  alternates: pageMetadata('/donate').alternates,
  openGraph: {
    ...pageMetadata('/donate').openGraph,
    title,
    description,
    images: [{ url: url('/donate/opengraph-image.png').href }],
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    images: [url('/donate/twitter-image.png').href],
  },
} satisfies Metadata

export default async function DonatePage() {
  const donors = await getDonors()

  return (
    <Container data-donate-page className="mt-16 sm:mt-32">
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: title, path: '/donate' },
        ]}
      />
      <header className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            {title}
          </h1>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-emerald-700 shadow-[0_0_10px_rgba(4,120,87,0.7)] dark:bg-emerald-400"
            />
            感谢支持
          </span>
        </div>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)] lg:items-start">
        <div className="min-w-0 space-y-10">
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">为什么捐赠</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">捐赠用于支付本站 VPS 与域名续费，让这个独立维护的技术博客继续稳定运行。金额随意，5 / 10 / 20 元只是参考。</p>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="建议金额">
              {[5, 10, 20].map((amount) => <span key={amount} className="rounded-lg border border-zinc-300 px-3 py-1.5 font-mono text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">¥{amount}</span>)}
            </div>
          </section>
          <section aria-labelledby="payment-heading">
            <h2
              id="payment-heading"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              常用支付
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              桌面端请用手机扫码；手机端可保存二维码后用对应 App 扫描。扫码后输入金额，并备注昵称便于核实。
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        支付宝
                      </h3>
                      <span className="rounded-full bg-emerald-700/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-700/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
                        推荐
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      打开支付宝扫码
                    </p>
                  </div>
                  <div className="mx-auto flex h-[216px] w-[216px] shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-zinc-900/5 xl:mx-0 xl:h-36 xl:w-36 dark:ring-white/10">
                    <Image
                      src="/donate-zfb.png"
                      alt="支付宝二维码"
                      width={200}
                      height={200}
                      className="h-full w-full"
                      unoptimized
                    />
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        微信支付
                      </h3>
                      <span className="rounded-full bg-emerald-700/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-700/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
                        推荐
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      打开微信扫码
                    </p>
                  </div>
                  <div className="mx-auto flex h-[216px] w-[216px] shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-zinc-900/5 xl:mx-0 xl:h-36 xl:w-36 dark:ring-white/10">
                    <Image
                      src="/donate-wx.png"
                      alt="微信支付二维码"
                      width={200}
                      height={200}
                      className="h-full w-full"
                      unoptimized
                    />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="crypto-heading">
            <h2
              id="crypto-heading"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              加密货币
            </h2>
            <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              转账前请仔细核对币种与网络：ETH 仅限 ERC20 以太坊主网，BTC 仅限比特币主网，USDT 使用 TRC20。网络选错可能导致资产无法找回。
            </p>
            <div className="mt-4 space-y-5">
              {donationAddresses.map((donation) => (
                <DonationAddress key={donation.currency} {...donation} />
              ))}
            </div>
          </section>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            捐完欢迎去
            <Link
              href="/guestbook"
              className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              留言墙
            </Link>
            冒个泡，让我知道这杯咖啡是谁请的。
          </p>
        </div>

        <aside className="space-y-5">
          <section
            className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-xs shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60"
            aria-labelledby="donors-heading"
          >
            <h2
              id="donors-heading"
              className="text-lg font-semibold tracking-tight text-zinc-800 dark:text-zinc-100"
            >
              感谢名单
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              感谢每一位请咖啡的朋友
            </p>
            {donors.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                虚位以待——第一杯咖啡等你来请。
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {donors.map((donor) => (
                  <li
                    key={`${donor.date}-${donor.name}`}
                    className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
                        {donor.name}
                      </span>
                      <time
                        dateTime={donor.date}
                        className="font-mono text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        {donor.date}
                      </time>
                    </div>
                    {donor.message ? (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {donor.message}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-xs shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">捐后说明</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">支付完成后欢迎在留言墙告诉我昵称，我会手动核实并更新感谢名单。上榜仅展示昵称与日期；不提供自助上榜，也不公开邮箱或钱包信息。</p>
          </section>
        </aside>
      </div>
    </Container>
  )
}

export const revalidate = 600
