import { currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '~/db'
import { GuestbookHashids } from '~/db/dto/guestbook.dto'
import { guestbook } from '~/db/schema'
import { ratelimit } from '~/lib/redis'

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

const ReplySchema = z.object({
  reply: z.string().trim().min(1).max(600),
})

function decodeGuestbookId(id: string) {
  const decoded = GuestbookHashids.decode(id)[0]
  return typeof decoded === 'number' ? decoded : null
}

async function requireSiteOwner() {
  const user = await currentUser()
  const isSiteOwner = Boolean(user?.publicMetadata?.siteOwner)

  return user && isSiteOwner ? user : null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireSiteOwner()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(`reply:${user.id}`))
  if (!success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  const guestbookId = decodeGuestbookId(params.id)
  if (guestbookId === null) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    const { reply } = ReplySchema.parse(await req.json())
    const [updated] = await db
      .update(guestbook)
      .set({ reply, repliedAt: new Date(), updatedAt: new Date() })
      .where(eq(guestbook.id, guestbookId))
      .returning({ reply: guestbook.reply, repliedAt: guestbook.repliedAt })

    if (!updated) {
      return NextResponse.json({ error: '留言不存在' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: '回复内容格式不正确' }, { status: 400 })
    }
    return NextResponse.json({ error: '回复失败，请稍后再试' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireSiteOwner()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(`delete:${user.id}`))
  if (!success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }

  const guestbookId = decodeGuestbookId(params.id)
  if (guestbookId === null) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    if (req.nextUrl.searchParams.get('reply') === 'true') {
      await db
        .update(guestbook)
        .set({ reply: null, repliedAt: null, updatedAt: new Date() })
        .where(eq(guestbook.id, guestbookId))
    } else {
      await db.delete(guestbook).where(eq(guestbook.id, guestbookId))
    }
    return NextResponse.json({ id: params.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
