import { Ratelimit } from '@upstash/ratelimit'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { resend } from '~/lib/mail'
import { redis } from '~/lib/redis'

const applicationSchema = z.object({
  siteName: z.string().trim().min(1).max(80),
  url: z.string().trim().url().max(2048).refine((value) => /^https?:\/\//i.test(value)),
  description: z.string().trim().min(1).max(240),
  email: z.string().trim().email().max(254),
  website: z.string().max(500).optional(),
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'friend-link-application',
})

export async function POST(req: NextRequest) {
  try {
    const payload: unknown = await req.json()
    const input = applicationSchema.parse(payload)
    if (input.website?.trim()) {
      return NextResponse.json({ message: '申请已收到，审核通过后会显示在关于页。' })
    }

    const ip = req.ip ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { message: '每个 IP 每小时最多提交 3 次，请稍后再试。' },
        { status: 429 }
      )
    }

    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: 'hi@reidliao.dev',
      reply_to: 'hi@reidliao.dev',
      subject: `友情链接申请：${input.siteName}`,
      text: [
        `站名：${input.siteName}`,
        `链接：${input.url}`,
        `简介：${input.description}`,
        `联系邮箱：${input.email}`,
      ].join('\n'),
    })
    if (error) throw new Error(error.message)

    return NextResponse.json({ message: '申请已送达；审核通过并发布后会显示在关于页。' })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ message: '请检查站名、链接、简介和邮箱格式。' }, { status: 400 })
    }
    console.error('[FriendLinkApplication]', error)
    return NextResponse.json({ message: '暂时无法提交，请稍后重试。' }, { status: 500 })
  }
}
