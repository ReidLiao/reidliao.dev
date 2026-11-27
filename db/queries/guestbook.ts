import { desc } from 'drizzle-orm'

import { db } from '~/db'
import { GuestbookHashids } from '~/db/dto/guestbook.dto'
import { guestbook } from '~/db/schema'

export const GUESTBOOK_PAGE_SIZE = 10

export async function fetchGuestbookMessages({
  limit = GUESTBOOK_PAGE_SIZE,
  offset = 0,
}: { limit?: number; offset?: number } = {}) {
  const data = await db
    .select({
      id: guestbook.id,
      userId: guestbook.userId,
      userInfo: guestbook.userInfo,
      message: guestbook.message,
      reply: guestbook.reply,
      repliedAt: guestbook.repliedAt,
      createdAt: guestbook.createdAt,
    })
    .from(guestbook)
    .orderBy(desc(guestbook.createdAt))
    .limit(limit + 1)
    .offset(offset)

  const hasMore = data.length > limit
  const page = data.slice(0, limit)

  return {
    messages: page.map(
      ({ id, ...rest }) => ({
        ...rest,
        id: GuestbookHashids.encode(id),
      })
    ),
    hasMore,
    nextOffset: offset + page.length,
  }
}
