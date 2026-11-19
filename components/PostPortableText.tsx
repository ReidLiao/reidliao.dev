'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import React from 'react'

import { PeekabooLink } from '~/components/links/PeekabooLink'
import {
  PortableTextBlocksBlockquote,
  PortableTextBlocksH1,
  PortableTextBlocksH2,
  PortableTextBlocksH3,
  PortableTextBlocksH4,
  PortableTextBlocksListItem,
  PortableTextBlocksNormal,
} from '~/components/portable-text/PortableTextBlocks'
import { PortableTextCodeBlock } from '~/components/portable-text/PortableTextCodeBlock'
import { PortableTextAccordion, PortableTextCallout, PortableTextLinkButton, PortableTextTable, PortableTextTimeline } from '~/components/portable-text/PortableTextCustomBlocks'
import { PortableTextDownload } from '~/components/portable-text/PortableTextDownload'
import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { PortableTextTweet } from '~/components/portable-text/PortableTextTweet'
import { PortableTextVideoEmbed } from '~/components/portable-text/PortableTextVideoEmbed'

function preserveNumbering(value: unknown) {
  if (!Array.isArray(value)) return value
  let running = 0
  let interrupted = false
  let currentList: string | undefined
  return (value as unknown[]).map((block) => {
    if (!block || typeof block !== 'object') return block
    const item = block as Record<string, unknown>
    if (item._type === 'block' && item.listItem === 'number') {
      const level = typeof item.level === 'number' ? item.level : 1
      const key = `${item.listItem}:${level}`
      if (currentList !== key && !interrupted) running = 0
      running += 1
      const next = interrupted ? { ...item, _listStart: running } : item
      currentList = key
      interrupted = false
      return next
    }
    if (item._type === 'block') {
      running = 0
      currentList = undefined
      interrupted = false
      return item
    }
    if (running > 0) interrupted = true
    return item
  })
}

const textColorClass: Record<string, string> = {
  lime: 'text-lime-700 dark:text-lime-400',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  sky: 'text-sky-700 dark:text-sky-300',
  amber: 'text-amber-700 dark:text-amber-300',
  rose: 'text-rose-700 dark:text-rose-300',
  violet: 'text-violet-700 dark:text-violet-300',
  zinc: 'text-zinc-600 dark:text-zinc-400',
}

const highlightClass: Record<string, string> = {
  lime: 'rounded-sm bg-lime-200/70 px-0.5 dark:bg-lime-400/20',
  emerald: 'rounded-sm bg-emerald-200/70 px-0.5 dark:bg-emerald-400/20',
  amber: 'rounded-sm bg-amber-200/70 px-0.5 dark:bg-amber-400/20',
  sky: 'rounded-sm bg-sky-200/70 px-0.5 dark:bg-sky-400/20',
  rose: 'rounded-sm bg-rose-200/70 px-0.5 dark:bg-rose-400/20',
  violet: 'rounded-sm bg-violet-200/70 px-0.5 dark:bg-violet-400/20',
}

const components: PortableTextComponents = {
  block: {
    normal: PortableTextBlocksNormal,
    h1: PortableTextBlocksH1,
    h2: PortableTextBlocksH2,
    h3: PortableTextBlocksH3,
    h4: PortableTextBlocksH4,
    blockquote: PortableTextBlocksBlockquote,
  },
  listItem: PortableTextBlocksListItem,
  list: {
    number: ({ children, value }) => {
      const first = (value as { children?: { _listStart?: number }[] }).children?.[0]
      return <ol start={first?._listStart ?? 1}>{children}</ol>
    },
  },
  types: {
    image: PortableTextImage,
    tweet: PortableTextTweet,
    codeBlock: PortableTextCodeBlock,
    download: PortableTextDownload,
    videoEmbed: PortableTextVideoEmbed,
    accordion: PortableTextAccordion,
    callout: PortableTextCallout,
    comparisonTable: PortableTextTable,
    timeline: PortableTextTimeline,
    linkButton: PortableTextLinkButton,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-inherit">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="text-inherit">{children}</code>
    ),
    underline: ({ children }) => <u>{children}</u>,
    'strike-through': ({ children }) => <del>{children}</del>,
    kbd: ({ children }) => <kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">{children}</kbd>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <PeekabooLink
          href={value.href}
          rel={rel}
          className="text-lime-700 decoration-lime-700/50 hover:text-lime-800 hover:decoration-lime-800 dark:text-lime-400 dark:decoration-lime-400/50 dark:hover:text-lime-300 dark:hover:decoration-lime-300"
          faviconClassName="rounded-full"
        >
          {children}
        </PeekabooLink>
      )
    },
    textColor: ({ children, value }) => {
      const cls = textColorClass[value?.color as string] || textColorClass.lime
      return (
        <span className={`${cls} [&_strong]:text-inherit [&_code]:text-inherit`}>
          {children}
        </span>
      )
    },
    highlight: ({ children, value }) => {
      const cls =
        highlightClass[value?.color as string] || highlightClass.lime
      return (
        <mark
          className={`${cls} text-inherit [&_strong]:text-inherit [&_code]:text-inherit`}
        >
          {children}
        </mark>
      )
    },
  },
}

export function PostPortableText(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  components?: PortableTextComponents
}) {
  return <PortableText value={preserveNumbering(props.value) as typeof props.value} components={props.components ?? components} />
}
