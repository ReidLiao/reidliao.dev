'use client'

import { Show, SignInButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

import { UserArrowLeftIcon } from '~/assets'
import { Button } from '~/components/shadcn/button'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'
import { url } from '~/lib'

import { GuestbookFeeds } from './GuestbookFeeds'
import { GuestbookInput } from './GuestbookInput'

export function Guestbook(props: {
  messages?: GuestbookDto[]
  hasMore?: boolean
  nextOffset?: number
}) {
  const pathname = usePathname()

  return (
    <section className="max-w-2xl">
      <div className="space-y-3">
        <GuestbookInput />
        <Show when="signed-out" treatPendingAsSignedOut>
          <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span>
              当前为匿名短留言（最多 120 字）。登录后可写更长内容并显示头像。
            </span>
            <SignInButton mode="modal" forceRedirectUrl={url(pathname).href}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <UserArrowLeftIcon className="mr-1 h-3.5 w-3.5" />
                登录
              </Button>
            </SignInButton>
          </p>
        </Show>
        <Show when="signed-in">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            已登录，可发布最长 600 字的 Markdown 留言。
          </p>
        </Show>
      </div>

      <GuestbookFeeds {...props} />
    </section>
  )
}
