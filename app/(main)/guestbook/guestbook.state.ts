import { proxy } from 'valtio'

import { type GuestbookDto } from '~/db/dto/guestbook.dto'

export const guestbookState = proxy<{
  messages: GuestbookDto[]
}>({
  messages: [],
})

export function setMessages(messages: GuestbookDto[]) {
  const recentIds = new Set(messages.map((message) => message.id))
  const olderMessages = guestbookState.messages.filter(
    (message) => !recentIds.has(message.id)
  )
  guestbookState.messages = [...messages, ...olderMessages]
}

export function appendMessages(messages: GuestbookDto[]) {
  const knownIds = new Set(guestbookState.messages.map((message) => message.id))
  guestbookState.messages.push(
    ...messages.filter((message) => !knownIds.has(message.id))
  )
}

export function signBook(message: GuestbookDto) {
  guestbookState.messages.splice(0, 0, message)
}

export function removeMessage(id: string) {
  const index = guestbookState.messages.findIndex((item) => item.id === id)
  if (index !== -1) {
    guestbookState.messages.splice(index, 1)
  }
}

export function updateMessageReply(
  id: string,
  reply: string | null,
  repliedAt: Date | string | null
) {
  const message = guestbookState.messages.find((item) => item.id === id)
  if (message) {
    message.reply = reply
    message.repliedAt = repliedAt
  }
}
