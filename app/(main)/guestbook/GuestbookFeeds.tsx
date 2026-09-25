'use client'

import 'dayjs/locale/zh-cn'

import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { useSnapshot } from 'valtio'

import { TiltedSendIcon, XIcon } from '~/assets'
import { CommentMarkdown } from '~/components/CommentMarkdown'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'
import { parseDisplayName } from '~/lib/string'

import {
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

  const { mutate: onDelete, isLoading } = useMutation(
    ['guestbook-delete', message.id],
    async () => {
      const res = await fetch(`/api/guestbook/${message.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('删除失败')
      }
      return message.id
    },
    {
      onSuccess: (id) => {
        removeMessage(id)
      },
    }
  )

  const { mutate: saveReply, isLoading: isSavingReply } = useMutation(
    ['guestbook-reply', message.id],
    async () => {
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
    {
      onSuccess: (data) => {
        updateMessageReply(message.id, data.reply ?? null, data.repliedAt ?? null)
        setIsReplying(false)
        setReplyError(null)
      },
      onError: (error: Error) => setReplyError(error.message),
    }
  )

  const { mutate: removeReply, isLoading: isRemovingReply } = useMutation(
    ['guestbook-reply-delete', message.id],
    async () => {
      const res = await fetch(`/api/guestbook/${message.id}?reply=true`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('删除回复失败，请稍后再试')
      }
    },
    {
      onSuccess: () => {
        updateMessageReply(message.id, null, null)
        setReply('')
        setIsReplying(false)
        setReplyError(null)
      },
      onError: (error: Error) => setReplyError(error.message),
    }
  )

  const isReplyLoading = isSavingReply || isRemovingReply

  return (
    <li className="relative pb-8">
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
                className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] text-zinc-600 transition hover:bg-lime-50 hover:text-lime-700 dark:text-zinc-400 dark:hover:bg-lime-950/30 dark:hover:text-lime-300"
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
        <div className="ml-[3.25rem] mt-3 rounded-xl border border-lime-500/30 bg-lime-500/5 p-3 dark:border-lime-400/25 dark:bg-lime-400/5">
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            maxLength={600}
            rows={3}
            placeholder="写一条站长回复..."
            className="block w-full resize-y rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-lime-400 dark:focus:ring-lime-400/20"
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
                className="inline-flex items-center gap-1 rounded-md bg-lime-500 px-2.5 py-1 text-xs font-medium text-zinc-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="ml-[3.25rem] mt-3 rounded-xl border-l-2 border-lime-500/70 bg-lime-500/5 px-3 py-2.5 dark:border-lime-400/60 dark:bg-lime-400/5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-lime-500/15 px-2 py-0.5 text-[11px] font-medium text-lime-700 dark:bg-lime-400/15 dark:text-lime-300">
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
      ) : null}
    </li>
  )
}
const MessageBlock = React.memo(Message)

export function GuestbookFeeds(props: { messages?: GuestbookDto[] }) {
  const { user } = useUser()
  const isSiteOwner = Boolean(
    (user?.publicMetadata as { siteOwner?: boolean } | undefined)?.siteOwner
  )

  const { data: feed } = useQuery(
    ['guestbook'],
    async () => {
      const res = await fetch('/api/guestbook')
      const data = await res.json()
      return data as GuestbookDto[]
    },
    {
      refetchInterval: 30000,
      initialData: props.messages ?? [],
    }
  )
  const { messages } = useSnapshot(guestbookState)
  React.useEffect(() => {
    setMessages(feed ?? [])
  }, [feed])

  return (
    <div className="relative mt-12">
      <ul role="list" className="-mb-8 px-1 md:px-4">
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
    </div>
  )
}
