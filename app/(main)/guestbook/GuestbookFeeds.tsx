'use client'

import 'dayjs/locale/zh-cn'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import React from 'react'
import { useSnapshot } from 'valtio'

import { TiltedSendIcon, XIcon } from '~/assets'
import { CommentMarkdown } from '~/components/CommentMarkdown'
import { Button } from '~/components/shadcn/button'
import { Skeleton } from '~/components/shadcn/skeleton'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'
import { parseDisplayName } from '~/lib/string'

import {
  appendMessages,
  guestbookState,
  removeMessage,
  setMessages,
  updateMessageReply,
} from './guestbook.state'

dayjs.extend(relativeTime)

function Message({
  message,
  idx,
  length,
  canDelete,
}: {
  message: GuestbookDto
  idx: number
  length: number
  canDelete: boolean
}) {
  const [isReplying, setIsReplying] = React.useState(false)
  const [reply, setReply] = React.useState(message.reply ?? '')
  const [replyError, setReplyError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setReply(message.reply ?? '')
  }, [message.reply])

  const { mutate: onDelete, isPending: isLoading } = useMutation({
    mutationKey: ['guestbook-delete', message.id],
    mutationFn: async () => {
      const res = await fetch(`/api/guestbook/${message.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('删除失败')
      }
      return message.id
    },
    onSuccess: (id) => {
        removeMessage(id)
    },
  })

  const { mutate: saveReply, isPending: isSavingReply } = useMutation({
    mutationKey: ['guestbook-reply', message.id],
    mutationFn: async () => {
      const res = await fetch(`/api/guestbook/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string | null
        repliedAt?: Date | string | null
        error?: string
      }
      if (!res.ok || !data.reply || !data.repliedAt) {
        throw new Error(data.error ?? '回复失败，请稍后再试')
      }
      return data
    },
    onSuccess: (data) => {
        updateMessageReply(message.id, data.reply ?? null, data.repliedAt ?? null)
        setIsReplying(false)
        setReplyError(null)
    },
    onError: (error: Error) => setReplyError(error.message),
  })

  const { mutate: removeReply, isPending: isRemovingReply } = useMutation({
    mutationKey: ['guestbook-reply-delete', message.id],
    mutationFn: async () => {
      const res = await fetch(`/api/guestbook/${message.id}?reply=true`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('删除回复失败，请稍后再试')
      }
    },
    onSuccess: () => {
        updateMessageReply(message.id, null, null)
        setReply('')
        setIsReplying(false)
        setReplyError(null)
    },
    onError: (error: Error) => setReplyError(error.message),
  })

  const isReplyLoading = isSavingReply || isRemovingReply

  return (
    <li className={`relative ${idx === length - 1 ? 'pb-0' : 'pb-8'}`}>
      {idx !== length - 1 && (
        <span
          className="absolute left-5 top-14 -ml-px h-[calc(100%-4.5rem)] w-0.5 rounded bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start space-x-3">
        <Image
          src={
            message.userInfo.imageUrl ?? `/avatars/avatar_${(idx % 8) + 1}.png`
          }
          alt=""
          width={40}
          height={40}
          sizes="40px"
          className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
          loading="lazy"
          unoptimized
        />
        <div className="-mt-1 flex min-w-0 flex-1 items-center gap-3">
          <b className="text-sm font-bold dark:text-zinc-100">
            {parseDisplayName(message.userInfo)}
          </b>
          <time
            dateTime={message.createdAt.toString()}
            className="inline-flex select-none text-[12px] font-medium text-zinc-600 dark:text-zinc-400"
          >
            {dayjs(message.createdAt).locale('zh-cn').fromNow()}
          </time>
          {canDelete ? (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReplying((value) => !value)}
                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-zinc-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
              >
                {message.reply ? '修改回复' : '回复'}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  if (window.confirm('确定删除这条留言？')) {
                    onDelete()
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-zinc-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                aria-label="删除留言"
              >
                <XIcon className="h-3.5 w-3.5" />
                删除
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="comment__message -mt-4 mb-1 pl-[3.25rem] text-sm">
        <CommentMarkdown>{message.message}</CommentMarkdown>
      </div>
      {canDelete && isReplying ? (
        <div className="ml-[3.25rem] mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            maxLength={600}
            rows={3}
            placeholder="写一条站长回复..."
            className="block w-full resize-y rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-800 outline-hidden transition placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {reply.length}/600
            </span>
            <div className="flex items-center gap-2">
              {message.reply ? (
                <button
                  type="button"
                  disabled={isReplyLoading}
                  onClick={() => {
                    if (window.confirm('确定删除这条回复？')) {
                      removeReply()
                    }
                  }}
                  className="rounded-md px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  删除回复
                </button>
              ) : null}
              <button
                type="button"
                disabled={isReplyLoading || reply.trim().length === 0}
                onClick={() => {
                  setReplyError(null)
                  saveReply()
                }}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-950 dark:hover:bg-zinc-300"
              >
                <TiltedSendIcon className="h-3.5 w-3.5" />
                保存回复
              </button>
            </div>
          </div>
          {replyError ? (
            <p className="mt-2 text-xs text-red-500">{replyError}</p>
          ) : null}
        </div>
      ) : null}
      {message.reply && message.repliedAt ? (
        <div className="ml-[3.25rem] mt-3 flex items-start gap-3">
          <Image
            src="/avatar-64.webp"
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200 ring-2 ring-zinc-200 [clip-path:circle(46%_at_50%_50%)] dark:bg-zinc-800 dark:ring-zinc-800"
            unoptimized
          />
          <div className="min-w-0 flex-1 rounded-xl border border-y-zinc-200 border-r-zinc-200 border-l-2 border-emerald-700/70 bg-white/70 px-3 py-2.5 dark:border-y-zinc-800 dark:border-r-zinc-800 dark:border-emerald-400/60 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-700/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400">
                站长
              </span>
              <time
                dateTime={message.repliedAt.toString()}
                className="text-[11px] text-zinc-500 dark:text-zinc-400"
              >
                {dayjs(message.repliedAt).locale('zh-cn').fromNow()}
              </time>
            </div>
            <div className="comment__message mt-2 text-sm">
              <CommentMarkdown>{message.reply}</CommentMarkdown>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  )
}
const MessageBlock = React.memo(Message)

type GuestbookPage = {
  messages: GuestbookDto[]
  hasMore: boolean
  nextOffset: number
}

export function GuestbookFeeds(props: {
  messages?: GuestbookDto[]
  hasMore?: boolean
  nextOffset?: number
}) {
  const { user } = useUser()
  const [hasMore, setHasMore] = React.useState(props.hasMore ?? false)
  const [nextOffset, setNextOffset] = React.useState(
    props.nextOffset ?? props.messages?.length ?? 0
  )
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [loadMoreError, setLoadMoreError] = React.useState<string | null>(null)
  const [isFeedSynced, setIsFeedSynced] = React.useState(false)
  const isSiteOwner = Boolean(
    (user?.publicMetadata as { siteOwner?: boolean } | undefined)?.siteOwner
  )

  const { data: feed, isLoading } = useQuery({
    queryKey: ['guestbook'],
    queryFn: async () => {
      const res = await fetch('/api/guestbook')
      const data = (await res.json()) as GuestbookPage & { error?: string }
      if (!res.ok || !Array.isArray(data.messages)) {
        throw new Error(data.error ?? '留言暂时无法加载，请稍后再试')
      }
      return data
    },
    refetchInterval: () =>
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible'
        ? 60000
        : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    initialData: props.messages
      ? {
          messages: props.messages,
          hasMore: props.hasMore ?? false,
          nextOffset: props.nextOffset ?? props.messages.length,
        }
      : undefined,
  })
  const snapshot = useSnapshot(guestbookState)
  const messages = isFeedSynced ? snapshot.messages : (feed?.messages ?? [])
  React.useEffect(() => {
    if (!feed) return
    setMessages(feed.messages)
    setIsFeedSynced(true)
    setHasMore(feed.hasMore)
    setNextOffset((current) => Math.max(current, feed.nextOffset))
  }, [feed])

  const loadMore = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    setLoadMoreError(null)
    try {
      const res = await fetch(`/api/guestbook?offset=${nextOffset}`)
      const data = (await res.json()) as GuestbookPage & { error?: string }
      if (!res.ok || !Array.isArray(data.messages)) {
        throw new Error(data.error ?? '留言加载失败，请稍后重试')
      }
      appendMessages(data.messages)
      setHasMore(data.hasMore)
      setNextOffset(data.nextOffset)
    } catch (error) {
      setLoadMoreError(
        error instanceof Error ? error.message : '留言加载失败，请稍后重试'
      )
    } finally {
      setIsLoadingMore(false)
    }
  }

  if (isLoading && !props.messages) {
    return (
      <div
        className="relative mt-12"
        role="status"
        aria-label="正在加载留言"
        aria-busy="true"
      >
        <ul role="list" className="-mb-8 px-1 md:px-4">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="relative pb-8">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-3 pt-1">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-5/6" />
                  {index % 2 === 0 ? (
                    <Skeleton className="h-12 w-4/5 rounded-xl" />
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <span className="sr-only">留言加载中</span>
      </div>
    )
  }

  return (
    <div className="relative mt-12">
      <ul role="list" className="px-1 md:px-4">
        {messages.map((message, idx) => (
          <MessageBlock
            key={message.id}
            message={message}
            idx={idx}
            length={messages.length}
            canDelete={isSiteOwner}
          />
        ))}
      </ul>
      {hasMore ? (
        <div className="relative z-10 mt-2 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isLoadingMore}
            aria-busy={isLoadingMore}
            onClick={loadMore}
            className="min-w-[6.5rem] rounded-full disabled:opacity-100"
          >
            {isLoadingMore && (
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
              />
            )}
            {isLoadingMore ? '加载中…' : '加载更多留言'}
          </Button>
          {loadMoreError ? (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {loadMoreError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
