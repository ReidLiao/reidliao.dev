'use server'

import { and, eq, isNull } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '~/db'
import { subscribers } from '~/db/schema'

export async function confirmSubscription(formData: FormData) {
  const token = formData.get('token')
  if (typeof token !== 'string' || !token) redirect('/')

  const [subscriber] = await db
    .update(subscribers)
    .set({ subscribedAt: new Date(), token: null })
    .where(and(eq(subscribers.token, token), isNull(subscribers.subscribedAt)))
    .returning({ id: subscribers.id })

  if (!subscriber) redirect('/')
  redirect('/confirm/complete')
}
