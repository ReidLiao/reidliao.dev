import { proxy } from 'valtio'

import { type GuestbookDto } from '~/db/dto/guestbook.dto'

export const guestbookState = proxy<{
  messages: GuestbookDto[]
}>({
  messages: [],
})

export function setMessages(messages: GuestbookDto[]) {
  guestbookState.messages = messages
}

export function signBook(message: GuestbookDto) {
  // insert message at index 0
  guestbookState.messages.splice(0, 0, message)
}

export function removeMessage(id: string) {
  const index = guestbookState.messages.findIndex((item) => item.id === id)
  if (index !== -1) {
    guestbookState.messages.splice(index, 1)
  }
}
