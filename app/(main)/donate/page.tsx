import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '~/components/ui/Container'
import { getDonors } from '~/sanity/queries'

import { DonationAddress } from './DonationAddress'

const title = '捐赠'
const description =
  '请我喝杯咖啡——本站 VPS、域名均为自费维护，捐赠用于覆盖服务器成本。先谢了，咖啡管够我就多更两篇。'

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
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
} satisfies Metadata

export default async function DonatePage() {
  const donors = await getDonors()

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            {title}
          </h1>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.7)] dark:bg-lime-400"
            />
            感谢支持
          </span>
        </div>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <section className="mt-12 max-w-2xl" aria-labelledby="payment-heading">
        <h2
          id="payment-heading"
          className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
        >
          常用支付
        </h2>
        <div className="mt-4 space-y-5">
          <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    支付宝
                  </h3>
                  <span className="rounded-full bg-lime-500/10 px-2 py-0.5 text-[11px] font-medium text-lime-700 ring-1 ring-lime-500/20 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/20">
                    推荐
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  打开支付宝扫一扫，金额随意
                </p>
              </div>
              <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-zinc-900/5 dark:ring-white/10">
                <Image
                  src="/donate-zfb.png"
                  alt="支付宝二维码"
                  width={192}
                  height={192}
                  className="h-full w-full"
                />
              </div>
            </div>
          </article>
          <article className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  微信支付
                </h3>
                <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  打开微信扫一扫，金额随意
                </p>
              </div>
              <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-zinc-900/5 dark:ring-white/10">
                <Image
                  src="/donate-wx.png"
                  alt="微信支付二维码"
                  width={192}
                  height={192}
                  className="h-full w-full"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mt-12 max-w-2xl" aria-labelledby="crypto-heading">
        <h2
          id="crypto-heading"
          className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
        >
          加密货币
        </h2>
        <div className="mt-4 space-y-5">
          {donationAddresses.map((donation) => (
            <DonationAddress key={donation.currency} {...donation} />
          ))}
        </div>
      </section>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        捐完欢迎去
        <Link
          href="/guestbook"
          className="transition hover:text-lime-600 dark:hover:text-lime-400"
        >
          留言墙
        </Link>
        冒个泡，让我知道这杯咖啡是谁请的。
      </p>

      <section className="mt-16 max-w-2xl" aria-labelledby="donors-heading">
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
          <p className="mt-6 rounded-2xl border border-dashed border-zinc-200 px-5 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            虚位以待——第一杯咖啡等你来请。
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {donors.map((donor) => (
                <li
                  key={`${donor.date}-${donor.name}`}
                  className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
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
    </Container>
  )
}

export const revalidate = 600
