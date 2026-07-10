import { currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

import { db } from '~/db'
import { GuestbookHashids } from '~/db/dto/guestbook.dto'
import { guestbook } from '~/db/schema'
import { ratelimit } from '~/lib/redis'

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser()
  const isSiteOwner = Boolean(user?.publicMetadata?.siteOwner)

  if (!user || !isSiteOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(`delete:${user.id}`))
  if (!success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  const decoded = GuestbookHashids.decode(params.id)
  const guestbookId = decoded[0]
  if (typeof guestbookId !== 'number') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    await db.delete(guestbook).where(eq(guestbook.id, guestbookId))
    return NextResponse.json({ id: params.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
