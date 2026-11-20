import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { UsersIcon } from '~/assets'
import { Container } from '~/components/ui/Container'
import { kvKeys } from '~/config/kv'
import { navigationItems } from '~/config/nav'
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

async function TotalPageViews() {
  noStore()

  try {
    const cached = await redis.get<number>(kvKeys.totalPageViewsCached)
    const views =
      typeof cached === 'number'
        ? cached
        : await redis.get<number>(kvKeys.totalPageViews)

    if (typeof views !== 'number') return null

    if (typeof cached !== 'number') {
      await redis.set(kvKeys.totalPageViewsCached, views, {
        ex: VIEWS_CACHE_TTL_SECONDS,
      })
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
  } catch {
    return null
  }
}

type VisitorGeolocation = {
  country: string
  city?: string
  flag: string
}

async function LastVisitorInfo() {
  noStore()

  try {
    const [lastVisitor, currentVisitor] = await redis.mget<VisitorGeolocation[]>(
      kvKeys.lastVisitor,
      kvKeys.currentVisitor
    )

    if (currentVisitor) {
      await redis.set(kvKeys.lastVisitor, currentVisitor)
    }

    const visitor = lastVisitor ?? currentVisitor
    if (!visitor) return null

    return (
      <span className="flex w-full max-w-[calc(100vw-6rem)] flex-nowrap items-center justify-center gap-1 whitespace-nowrap text-center text-xs text-zinc-500 dark:text-zinc-400 md:w-auto md:max-w-none md:justify-start md:text-left">
        <span className="inline-flex items-center gap-1">
          <MapPinIcon className="h-4 w-4 shrink-0" />
          <span>最近访客来自</span>
        </span>
        <span className="inline-flex max-w-full shrink-0 items-center gap-1 whitespace-nowrap">
          {visitor.city ? `${visitor.city}, ` : ''}
          {visitor.country}{' '}
          <span className="font-medium">{visitor.flag}</span>
        </span>
      </span>
    )
  } catch {
    return null
  }
}

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div data-footer-newsletter className="mx-auto mb-10 max-w-md">
              <Suspense fallback={<Newsletter subCount="6" variant="footer" />}>
                <Newsletter subCount="6" variant="footer" />
              </Suspense>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
                <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 md:justify-start">
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
                <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {navigationItems.map(({ href, text }) => (
                    <Link
                      key={href}
                      href={href}
                      className="transition hover:text-lime-600 dark:hover:text-lime-400"
                    >
                      {text}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-x-4 md:text-left">
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
