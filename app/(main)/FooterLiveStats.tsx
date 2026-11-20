'use client'

import React from 'react'

import { UsersIcon } from '~/assets'
import { prettifyNumber } from '~/lib/math'

type VisitorGeolocation = {
  country: string
  city?: string
  flag: string
}

type FooterStats = {
  totalViews: number | null
  visitor: VisitorGeolocation | null
}

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

export function FooterLiveStats() {
  const [stats, setStats] = React.useState<FooterStats | null>(null)

  React.useEffect(() => {
    const controller = new AbortController()

    void fetch('/api/footer-stats', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as FooterStats
      })
      .then((data) => {
        if (data) setStats(data)
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  return (
    <div className="flex min-h-9 flex-col items-center gap-4 text-center md:min-h-4 md:flex-row md:gap-x-4 md:text-left">
      {typeof stats?.totalViews === 'number' ? (
        <span className="flex items-center justify-start gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <UsersIcon className="h-4 w-4" />
          <span title={`${Intl.NumberFormat('en-US').format(stats.totalViews)}次浏览`}>
            总浏览量&nbsp;
            <span className="font-medium">
              {prettifyNumber(stats.totalViews, true)}
            </span>
          </span>
        </span>
      ) : null}
      {stats?.visitor ? (
        <span className="flex w-full max-w-[calc(100vw-6rem)] flex-nowrap items-center justify-center gap-1 whitespace-nowrap text-center text-xs text-zinc-500 dark:text-zinc-400 md:w-auto md:max-w-none md:justify-start md:text-left">
          <span className="inline-flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            <span>最近访客来自</span>
          </span>
          <span className="inline-flex max-w-full shrink-0 items-center gap-1 whitespace-nowrap">
            {stats.visitor.city ? `${stats.visitor.city}, ` : ''}
            {stats.visitor.country}{' '}
            <span className="font-medium">{stats.visitor.flag}</span>
          </span>
        </span>
      ) : null}
    </div>
  )
}
