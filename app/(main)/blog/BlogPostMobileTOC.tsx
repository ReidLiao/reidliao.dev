'use client'

import React from 'react'

import { Layers3Icon } from '~/assets'

interface HeadingNode {
  _type: 'span'
  text: string
  _key: string
}

interface Node {
  _type: 'block'
  style: 'h1' | 'h2' | 'h3' | 'h4'
  _key: string
  children?: HeadingNode[]
}

function toOutline(nodes: Node[]) {
  return nodes
    .filter((node) => node._type === 'block' && node.style.startsWith('h'))
    .map((node) => ({
      style: node.style,
      text: node.children?.[0]?.text ?? '',
      id: node._key,
    }))
    .filter((n) => n.text.length > 0)
}

/**
 * Collapsible TOC for md / mobile screens. Desktop uses the sticky sidebar
 * (`BlogPostTableOfContents`) instead.
 */
export function BlogPostMobileTOC({ headings }: { headings: Node[] }) {
  const outline = React.useMemo(() => toOutline(headings), [headings])
  const detailsRef = React.useRef<HTMLDetailsElement>(null)

  if (outline.length === 0) return null

  const onNavigate = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  return (
    <details
      ref={detailsRef}
      className="group mb-8 rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-900/50 lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
        <span className="inline-flex items-center gap-2">
          <Layers3Icon className="h-4 w-4" />
          文章目录
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
            {outline.length}
          </span>
        </span>
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-zinc-400 transition-transform duration-200 group-open:rotate-180 dark:text-zinc-500"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <ul className="border-t border-zinc-200/70 px-2 py-2 dark:border-zinc-700/50">
        {outline.map((node) => (
          <li key={node.id}>
            <a
              href={`#${node.id}`}
              onClick={onNavigate}
              className={
                'block truncate rounded-md px-2 py-1.5 text-[13px] leading-5 text-zinc-600 transition-colors hover:bg-lime-500/10 hover:text-lime-700 dark:text-zinc-400 dark:hover:bg-lime-400/10 dark:hover:text-lime-300' +
                (node.style === 'h3' ? ' pl-5' : '') +
                (node.style === 'h4' ? ' pl-8' : '')
              }
            >
              {node.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
