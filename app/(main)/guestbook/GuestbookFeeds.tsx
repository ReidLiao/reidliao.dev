'use client'

import 'dayjs/locale/zh-cn'

import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { useSnapshot } from 'valtio'

import { XIcon } from '~/assets'
import { CommentMarkdown } from '~/components/CommentMarkdown'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'
import { parseDisplayName } from '~/lib/string'

import {
  guestbookState,
  removeMessage,
  setMessages,
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
          className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
          unoptimized
        />
        <div className="-mt-1 flex min-w-0 flex-1 items-center gap-3">
          <b className="text-sm font-bold dark:text-zinc-100">
            {parseDisplayName(message.userInfo)}
          </b>
          <time
            dateTime={message.createdAt.toString()}
            className="inline-flex select-none text-[12px] font-medium opacity-40"
          >
            {dayjs(message.createdAt).locale('zh-cn').fromNow()}
          </time>
          {canDelete ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                if (window.confirm('确定删除这条留言？')) {
                  onDelete()
                }
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              aria-label="删除留言"
            >
              <XIcon className="h-3.5 w-3.5" />
              删除
            </button>
          ) : null}
        </div>
      </div>
      <div className="comment__message -mt-4 mb-1 pl-[3.25rem] text-sm">
        <CommentMarkdown>{message.message}</CommentMarkdown>
      </div>
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
      <div className="absolute inset-0 flex items-center" aria-hidden="true" />

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
