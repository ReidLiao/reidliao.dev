import { count, isNotNull } from 'drizzle-orm'
import { unstable_noStore as noStore } from 'next/cache'
import React, { Suspense } from 'react'

import { UsersIcon } from '~/assets'
import { Container } from '~/components/ui/Container'
import { kvKeys } from '~/config/kv'
import { db } from '~/db'
import { subscribers } from '~/db/schema'
import { isProduction } from '~/lib/is-production'
import { prettifyNumber } from '~/lib/math'
import { redis } from '~/lib/redis'

import { Newsletter } from './Newsletter'

const VIEWS_CACHE_TTL_SECONDS = 60

function MapPinIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

async function FooterNewsletter() {
  noStore()

  const [subs] = await db
    .select({
      subCount: count(),
    })
    .from(subscribers)
    .where(isNotNull(subscribers.subscribedAt))

  return <Newsletter subCount={`${subs?.subCount ?? '0'}`} />
}

async function TotalPageViews() {
  noStore()

  let views: number
  if (isProduction) {
    const cached = await redis.get<number>(kvKeys.totalPageViewsCached)
    if (typeof cached === 'number') {
      views = cached
    } else {
      views = (await redis.get<number>(kvKeys.totalPageViews)) ?? 0
      await redis.set(kvKeys.totalPageViewsCached, views, {
        ex: VIEWS_CACHE_TTL_SECONDS,
      })
    }
  } else {
    views = 345678
  }

  return (
    <span className="flex items-center justify-start gap-1 text-xs text-zinc-500 dark:text-zinc-400">
      <UsersIcon className="h-4 w-4" />
      <span title={`${Intl.NumberFormat('en-US').format(views)}次浏览`}>
        总浏览量&nbsp;
        <span className="font-medium">{prettifyNumber(views, true)}</span>
      </span>
    </span>
  )
}

type VisitorGeolocation = {
  country: string
  city?: string
  flag: string
}

async function LastVisitorInfo() {
  noStore()

  let lastVisitor: VisitorGeolocation | undefined = undefined
  if (isProduction) {
    const [lv, cv] = await redis.mget<VisitorGeolocation[]>(
      kvKeys.lastVisitor,
      kvKeys.currentVisitor
    )
    lastVisitor = lv
    if (cv) {
      await redis.set(kvKeys.lastVisitor, cv)
    }
  }

  if (!lastVisitor) {
    lastVisitor = {
      country: 'US',
      flag: '🇺🇸',
    }
  }

  return (
    <span className="flex items-center justify-start gap-1 text-xs text-zinc-500 dark:text-zinc-400">
      <MapPinIcon className="h-4 w-4" />
      <span>
        最近访客来自&nbsp;
        {[lastVisitor.city, lastVisitor.country].filter(Boolean).join(', ')}
      </span>
      <span className="font-medium">{lastVisitor.flag}</span>
    </span>
  )
}

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div data-footer-newsletter className="mx-auto mb-8 max-w-md">
              <Suspense fallback={<Newsletter subCount="0" />}>
                <FooterNewsletter />
              </Suspense>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>&copy; {new Date().getFullYear()} 青柠夜栈</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    </span>
                    <span>
                      Crafted with{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                        Next.js
                      </span>{' '}
                      &amp;{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                        Tailwind
                      </span>
                    </span>
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Suspense>
                  <TotalPageViews />
                </Suspense>
                <Suspense>
                  <LastVisitorInfo />
                </Suspense>
              </div>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
