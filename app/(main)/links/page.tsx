import type { Metadata } from 'next'
import Image from 'next/image'

import { BreadcrumbJsonLd } from '~/components/BreadcrumbJsonLd'
import { Container } from '~/components/ui/Container'
import { url } from '~/lib'
import { pageMetadata } from '~/lib/page-metadata'
import { getApprovedFriendLinks } from '~/sanity/queries'

import { FriendLinkApplicationForm } from './FriendLinkApplicationForm'

const title = '友情链接'
const description =
  '这里收录经站长审核通过的个人博客与技术站。你可以浏览已审核名单，或提交站名、链接、简介和联系邮箱申请；邮箱仅用于核实或回复，不会公开。'

export const metadata = {
  title,
  description,
  ...pageMetadata('/links'),
  openGraph: {
    ...pageMetadata('/links').openGraph,
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

export default async function FriendLinksPage() {
  const friendLinks = await getApprovedFriendLinks().catch((error) => {
    console.error('[Sanity friend links]', error)
    return []
  })

  return (
    <Container className="mt-16 sm:mt-32">
      <BreadcrumbJsonLd
        items={[
          { name: '首页', path: '/' },
          { name: title, path: '/links' },
        ]}
      />
      <header className="max-w-2xl">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">/links</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">友情链接</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          收录认真维护的个人博客与技术站。申请经站长审核通过后展示。
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
        <section aria-labelledby="friend-link-application-heading" className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
          <h2 id="friend-link-application-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">申请说明</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">填写站名、链接、简介和联系邮箱。邮箱仅用于核实信息或回复，不会公开。</p>
          <p className="mt-4 border-t border-zinc-200 pt-4 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">申请条件</p>
          <ul className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
            <li>个人博客或技术站</li>
            <li>有原创内容</li>
            <li>近 3 个月有更新</li>
            <li>网站可以正常访问</li>
            <li>需要添加本站链接</li>
            <li>内容合法，非纯营销或采集站</li>
          </ul>
          <FriendLinkApplicationForm />
        </section>

        <section aria-labelledby="approved-friend-links-heading" className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
          <h2 id="approved-friend-links-heading" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">已审核名单</h2>
          {friendLinks.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {friendLinks.map((friend) => (
                <li key={friend._id}>
                  <a href={friend.url} target="_blank" rel="noopener noreferrer" className="flex h-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 transition hover:border-lime-500/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-lime-400/40">
                    {friend.avatar?.asset?.url ? (
                      <Image src={friend.avatar.asset.url} alt="" width={44} height={44} unoptimized className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 font-semibold text-lime-800 dark:text-lime-300">{friend.siteName.slice(0, 1)}</span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{friend.siteName}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{friend.description}</span>
                      <span className="sr-only">（新窗口打开）</span>
                    </span>
                    <span aria-hidden="true" className="ml-auto shrink-0 text-zinc-400">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-zinc-300 px-4 py-5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">暂无已审核友链。</p>
          )}
        </section>
      </div>

    </Container>
  )
}
