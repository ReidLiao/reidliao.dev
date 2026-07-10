import { currentUser } from '@clerk/nextjs'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { type GuestbookDto, GuestbookHashids } from '~/db/dto/guestbook.dto'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'
import { guestbook } from '~/db/schema'
import NewGuestbookEmail from '~/emails/NewGuestbook'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { resend } from '~/lib/mail'
import { ratelimit } from '~/lib/redis'

const ANONYMOUS_USER_ID = 'anonymous'
const MAX_AUTHED_LENGTH = 600
const MAX_ANONYMOUS_LENGTH = 120

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

export async function GET(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ''))
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    return NextResponse.json(await fetchGuestbookMessages())
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

const SignGuestbookSchema = z.object({
  message: z.string().min(1),
  anonymous: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const user = await currentUser()

  try {
    const data = await req.json()
    const { message, anonymous } = SignGuestbookSchema.parse(data)
    const isAnonymous = !user || anonymous === true

    if (isAnonymous && message.length > MAX_ANONYMOUS_LENGTH) {
      return NextResponse.json(
        { error: `匿名留言不能超过 ${MAX_ANONYMOUS_LENGTH} 字` },
        { status: 400 }
      )
    }

    if (!isAnonymous && message.length > MAX_AUTHED_LENGTH) {
      return NextResponse.json(
        { error: `留言不能超过 ${MAX_AUTHED_LENGTH} 字` },
        { status: 400 }
      )
    }

    const rateLimitKey = isAnonymous
      ? getKey(`anon:${req.ip ?? 'unknown'}`)
      : getKey(user!.id)

    const { success } = await ratelimit.limit(rateLimitKey)
    if (!success) {
      return NextResponse.json(
        { error: '发送太频繁，请稍后再试' },
        { status: 429 }
      )
    }

    const guestbookData = isAnonymous
      ? {
          userId: ANONYMOUS_USER_ID,
          message,
          userInfo: {
            firstName: '访客',
            lastName: null,
            imageUrl: null,
          },
        }
      : {
          userId: user!.id,
          message,
          userInfo: {
            firstName: user!.firstName,
            lastName: user!.lastName,
            imageUrl: user!.imageUrl,
          },
        }

    if (env.NODE_ENV === 'production' && env.SITE_NOTIFICATION_EMAIL_TO) {
      await resend.emails.send({
        from: emailConfig.from,
        to: env.SITE_NOTIFICATION_EMAIL_TO,
        subject: isAnonymous
          ? '👋 有人匿名在留言墙留言了'
          : '👋 有人刚刚在留言墙留言了',
        react: NewGuestbookEmail({
          link: url(`/guestbook`).href,
          userFirstName: guestbookData.userInfo.firstName,
          userLastName: guestbookData.userInfo.lastName,
          userImageUrl: guestbookData.userInfo.imageUrl,
          commentContent: message,
        }),
      })
    }

    const [newGuestbook] = await db
      .insert(guestbook)
      .values(guestbookData)
      .returning({
        newId: guestbook.id,
      })

    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook.newId),
        createdAt: new Date(),
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
