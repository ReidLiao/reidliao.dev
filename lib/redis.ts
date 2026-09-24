import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import { env } from '~/env.mjs'

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// Create a new ratelimiter, that allows 30 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '10 s'),
  analytics: true,
})

export async function getReactions(id: string): Promise<number[]> {
  const key = `reactions:${id}`
  const value = await redis.get<number[]>(key)
  if (value) return value

  const initial = [0, 0, 0, 0]
  await redis.set(key, initial)
  return initial
}
