'use client'

import { useId, useRef, useState } from 'react'

import { cn } from '~/lib/utils'

export type TabEntry = { title: string; content: string }

export function Tabs({ tabs }: { tabs: TabEntry[] }) {
  const id = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  if (!tabs.length) return null

  function selectAndFocus(index: number) {
    const next = (index + tabs.length) % tabs.length
    setActiveIndex(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div
        role="tablist"
        aria-label="内容标签"
        className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950/50"
      >
        {tabs.map((tab, index) => (
          <button
            key={`${tab.title}-${index}`}
            ref={(element) => {
              refs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={activeIndex === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                selectAndFocus(index + 1)
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                selectAndFocus(index - 1)
              } else if (event.key === 'Home') {
                event.preventDefault()
                selectAndFocus(0)
              } else if (event.key === 'End') {
                event.preventDefault()
                selectAndFocus(tabs.length - 1)
              }
            }}
            className={cn(
              'min-h-11 shrink-0 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700/70 focus-visible:outline-none dark:focus-visible:ring-emerald-400/70',
              activeIndex === index
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-zinc-800 dark:text-emerald-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-${activeIndex}`}
        aria-labelledby={`${id}-tab-${activeIndex}`}
        tabIndex={0}
        className="p-4 text-sm leading-relaxed whitespace-pre-line text-zinc-700 focus-visible:ring-2 focus-visible:ring-emerald-700/70 focus-visible:outline-none focus-visible:ring-inset dark:text-zinc-300 dark:focus-visible:ring-emerald-400/70"
      >
        {tabs[activeIndex]?.content}
      </div>
    </div>
  )
}
