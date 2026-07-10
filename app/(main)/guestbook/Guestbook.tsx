'use client'

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

import { UserArrowLeftIcon } from '~/assets'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'
import { url } from '~/lib'

import { GuestbookFeeds } from './GuestbookFeeds'
import { GuestbookInput } from './GuestbookInput'

export function Guestbook(props: { messages?: GuestbookDto[] }) {
  const pathname = usePathname()

  return (
    <section className="max-w-2xl">
      <div className="space-y-3">
        <GuestbookInput />
        <SignedOut>
          <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              当前为匿名短留言（最多 120 字）。登录后可写更长内容并显示头像。
            </span>
            <SignInButton mode="modal" redirectUrl={url(pathname).href}>
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <UserArrowLeftIcon className="mr-1 h-3.5 w-3.5" />
                登录
              </button>
            </SignInButton>
          </p>
        </SignedOut>
        <SignedIn>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            已登录，可发布最长 600 字的 Markdown 留言。
          </p>
        </SignedIn>
      </div>

      <GuestbookFeeds messages={props.messages} />
    </section>
  )
}
