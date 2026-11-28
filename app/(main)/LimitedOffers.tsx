'use client'

import { Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '~/components/shadcn/badge'
import { Button } from '~/components/shadcn/button'
import { Card } from '~/components/shadcn/card'
import { cdnImageSrc } from '~/lib/cdn-image'
import type { HomepageOffer } from '~/sanity/queries'

import {
  describeOffer,
  formatOfferCountdown,
  offerCategories,
  parseOfferDeadline,
} from './offer-display'

const filterStyle =
  'h-7 min-h-7 shrink-0 cursor-pointer bg-white px-1.5 text-[10px] text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const filterOn =
  'border-zinc-800 bg-zinc-800 text-white hover:border-zinc-700 hover:bg-zinc-700 hover:text-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:border-zinc-500 dark:hover:bg-zinc-600'
const avatarRing =
  'ring-1 ring-zinc-200 group-hover/supplier:ring-emerald-700 dark:ring-zinc-700 dark:group-hover/supplier:ring-emerald-400'
const categoryTotals = [
  ['限时', '限时'],
  ['免费', '免费'],
  ['新用户', '新用户'],
] as const

function SupplierAvatar({
  name,
  logo,
}: {
  name: string
  logo?: string | null
}) {
  return logo ? (
    <Image
      src={cdnImageSrc(logo, { width: 96, quality: 85 })}
      alt=""
      width={40}
      height={40}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    name.slice(0, 2)
  )
}

export function LimitedOffers({
  offers,
  allLink,
  avatarNote,
  description,
}: {
  offers: HomepageOffer[]
  allLink?: string | null
  avatarNote?: string | null
  description?: string | null
}) {
  const [company, setCompany] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [now, setNow] = useState<number | null>(null)

  const suppliers = new Map<string, string | null>()
  const tags = new Set<string>(offerCategories)
  const items = offers.map((offer) => {
    const details = describeOffer(offer.title, offer.tags ?? [])
    const deadline = parseOfferDeadline(offer.deadline) ?? details.deadline
    const title =
      offer.company && offer.title.startsWith(`${offer.company} `)
        ? offer.title.slice(offer.company.length).trimStart()
        : offer.title
    const price = details.price
    const titleWithoutPunctuation = title.replace(/[。！!，,]+$/, '').trimEnd()
    const titleWithoutPrice =
      price && price !== '免费' && titleWithoutPunctuation.endsWith(price)
        ? titleWithoutPunctuation
            .slice(0, -price.length)
            .replace(/[\s，,：:]+$/, '')
        : title
    return {
      ...offer,
      ...details,
      deadline,
      displayTitle: titleWithoutPrice || title,
    }
  })
  let lastDeadline = 0
  for (const offer of items) {
    if (offer.company && !suppliers.get(offer.company)) {
      suppliers.set(offer.company, offer.logo ?? null)
    }
    for (const value of offer.categories) tags.add(value)
    lastDeadline = Math.max(lastDeadline, offer.deadline ?? 0)
  }
  const supplierEntries = [...suppliers]
  const visibleSuppliers = supplierEntries.slice(0, 5)
  const hiddenSupplierCount = supplierEntries.length - visibleSuppliers.length
  const matchingOffers = items.filter(
    (offer) =>
      (!company || offer.company === company) &&
      (!tag || offer.categories.has(tag))
  )
  const stats = [
    { label: '活动', count: items.length },
    ...categoryTotals.map(([category, label]) => ({
      label,
      count: items.filter((offer) => offer.categories.has(category)).length,
    })),
  ].filter(({ count }) => count > 0)

  useEffect(() => {
    if (!lastDeadline) return
    const startedAt = Date.now()
    setNow(startedAt)
    if (startedAt >= lastDeadline) return

    const timer = window.setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      if (currentTime >= lastDeadline) window.clearInterval(timer)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [lastDeadline])

  return (
    <Card as="section" className="min-w-0 items-stretch rounded-2xl p-5 sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <Tag aria-hidden="true" className="h-5 w-5 flex-none" />
          最新优惠
        </h2>
        <Link
          href={allLink?.trim() || '/vps'}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          全部活动
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description?.trim() ||
          '我自己在用的几家，活动价比日常价划算不少。'}
      </p>

      {suppliers.size > 0 ? (
        <div className="mt-2 flex min-w-0 flex-nowrap items-center gap-3">
          <div
            role="group"
            aria-label="按服务筛选活动"
            className="flex shrink-0 items-center"
          >
            {visibleSuppliers.map(([name, logo]) => (
              <Button
                key={name}
                variant="ghost"
                size="icon"
                aria-label={name}
                aria-pressed={company === name}
                title={name}
                onClick={() => setCompany(company === name ? null : name)}
                className="group/supplier -ml-4 h-12 w-12 shrink-0 cursor-pointer rounded-full first:ml-0 hover:bg-transparent dark:hover:bg-transparent"
              >
                <span
                  className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-white bg-zinc-100 text-xs font-semibold text-zinc-700 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 ${company === name ? 'ring-2 ring-emerald-700 dark:ring-emerald-400' : avatarRing}`}
                >
                  <SupplierAvatar name={name} logo={logo} />
                </span>
              </Button>
            ))}
            {hiddenSupplierCount > 0 ? (
              <span
                role="img"
                aria-label={`另有 ${hiddenSupplierCount} 个服务`}
                className="-ml-4 grid h-12 w-12 shrink-0 place-items-center rounded-full"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-zinc-200 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700">
                  +{hiddenSupplierCount}
                </span>
              </span>
            ) : null}
          </div>
          <p className="min-w-0 flex-1 truncate text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {avatarNote?.trim() ||
              `覆盖 ${suppliers.size} 个常用服务 · 点击头像筛选活动`}
          </p>
        </div>
      ) : null}

      <div
        role="group"
        aria-label="按活动标签筛选"
        className="mt-3 flex flex-wrap gap-2 sm:gap-2.5"
      >
        <Button
          variant="outline"
          size="sm"
          aria-pressed={!tag && !company}
          onClick={() => {
            setTag(null)
            setCompany(null)
          }}
          className={`${filterStyle} ${tag || company ? '' : filterOn}`}
        >
          全部
        </Button>
        {[...tags].map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={tag === value}
            onClick={() => setTag(tag === value ? null : value)}
            className={`${filterStyle} ${tag === value ? filterOn : ''}`}
          >
            {value}
          </Button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {matchingOffers.length
          ? `共 ${matchingOffers.length} 项优惠活动`
          : '没有匹配的优惠活动'}
      </p>
      {matchingOffers.length ? (
        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-700/40">
          {matchingOffers.map((offer) => (
            <li key={offer._key}>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/offer flex min-h-14 items-center gap-2.5 rounded-md py-2.5 sm:gap-3"
              >
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 flex-none place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700"
                >
                  <SupplierAvatar
                    name={offer.company ?? ''}
                    logo={offer.logo ?? suppliers.get(offer.company)}
                  />
                </span>
                <span
                  title={offer.displayTitle}
                  className="min-w-0 flex-1 text-sm leading-5 text-zinc-900 group-hover/offer:text-emerald-700 dark:text-zinc-100 dark:group-hover/offer:text-emerald-400"
                >
                  <span className="block truncate font-semibold">
                    {offer.company ? (
                      <span className="sr-only">{offer.company} </span>
                    ) : null}
                    {offer.displayTitle}
                  </span>
                  {offer.subtitle ? (
                    <span className="mt-0.5 block truncate text-xs text-zinc-600 dark:text-zinc-400">
                      {offer.subtitle}
                    </span>
                  ) : null}
                </span>
                <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                  {offer.price ? (
                    <Badge className="whitespace-nowrap leading-4">
                      {offer.price}
                    </Badge>
                  ) : null}
                  {offer.deadline !== null && now !== null ? (
                    <span
                      role="timer"
                      className="text-[11px] tabular-nums leading-4 text-zinc-600 dark:text-zinc-400"
                    >
                      {formatOfferCountdown(offer.deadline, now)}
                    </span>
                  ) : null}
                </div>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 flex-none text-zinc-500 dark:text-zinc-400"
                >
                  <path d="m6 4 4 4-4 4" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
          {offers.length
            ? '没有符合当前筛选条件的活动。'
            : '暂时没有优惠活动。'}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200/80 pt-3 text-xs leading-5 text-zinc-600 dark:border-zinc-700/40 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        {stats.length ? (
          <ul aria-label="活动统计" className="flex flex-wrap gap-x-4 gap-y-1">
            {stats.map(({ label, count }) => (
              <li key={label}>
                <strong className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {count}
                </strong>
                {' 个'}
                {label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Card>
  )
}
