import Link from 'next/link'

import { clsxm } from '@zolplay/utils'

import { getBlogCategories } from '~/sanity/queries'

export async function BlogCategoryTabs({
  activeCategory,
}: {
  activeCategory?: string
}) {
  const categories = (await getBlogCategories()) ?? []
  if (categories.length === 0) return null

  const tabs = [{ label: '全部', value: undefined }, ...categories.map((c) => ({ label: c, value: c }))]

  return (
    <nav
      aria-label="文章分类"
      className="flex flex-wrap gap-2"
    >
      {tabs.map((tab) => {
        const isActive =
          (tab.value === undefined && !activeCategory) ||
          (tab.value !== undefined && activeCategory === tab.value)
        return (
          <Link
            key={tab.label}
            href={tab.value ? `/blog?category=${encodeURIComponent(tab.value)}` : '/blog'}
            scroll={false}
            className={clsxm(
              'inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'border-lime-500/50 bg-lime-500/10 text-lime-700 dark:border-lime-400/40 dark:bg-lime-400/10 dark:text-lime-300'
                : 'border-zinc-200 text-zinc-600 hover:border-lime-500/40 hover:text-lime-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-lime-400/40 dark:hover:text-lime-400'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
