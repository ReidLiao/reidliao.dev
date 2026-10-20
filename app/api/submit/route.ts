import { Ratelimit } from '@upstash/ratelimit'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { resend } from '~/lib/mail'
import { redis } from '~/lib/redis'

const submissionSchema = z.object({
  type: z.enum(['软件', '资源']),
  name: z.string().trim().min(1).max(100),
  introduction: z.string().trim().min(1).max(300),
  url: z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value)),
  nickname: z.string().trim().min(1).max(80),
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: 'submit-recommendation',
})

export async function POST(req: NextRequest) {
  try {
    const payload: unknown = await req.json()
    if (
      payload &&
      typeof payload === 'object' &&
      'website' in payload &&
      typeof payload.website === 'string' &&
      payload.website.trim()
    ) {
      return NextResponse.json({ status: 'success' })
    }
    const input = submissionSchema.parse(payload)

    const ip = req.ip ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { status: 'rate-limited', message: '每个 IP 每小时最多提交 3 次，请稍后再试。' },
        { status: 429 }
      )
    }

    const details = [
      `类型：${input.type}`,
      `名称：${input.name}`,
      `介绍：${input.introduction}`,
      `链接：${input.url}`,
      `投稿人：${input.nickname}`,
    ]
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: 'hi@reidliao.dev',
      reply_to: 'hi@reidliao.dev',
      subject: `投稿推荐：${input.name}`,
      text: details.join('\n'),
    })
    if (error) throw new Error(error.message)

    return NextResponse.json({ status: 'success', message: '投稿已送达，感谢推荐！' })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        { status: 'invalid', message: '请检查填写内容和链接格式后重试。' },
        { status: 400 }
      )
    }
    console.error('[SubmitRecommendation]', error)
    return NextResponse.json(
      { status: 'error', message: '暂时无法提交，请稍后再试或直接邮件联系我。' },
      { status: 500 }
    )
  }
}
