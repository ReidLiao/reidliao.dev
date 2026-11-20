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
import { PortableTextDownload } from '~/components/portable-text/PortableTextDownload'
import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { PortableTextTweet } from '~/components/portable-text/PortableTextTweet'
import { PortableTextVideoEmbed } from '~/components/portable-text/PortableTextVideoEmbed'

function preserveNumberingAcrossCodeBlocks(value: unknown) {
  if (!Array.isArray(value)) return value

  const blocks = value as unknown[]
  let number = 0
  let listLevel: number | undefined
  let previousWasNumbered = false
  let separatedByCodeBlock = false

  return blocks.map((block): unknown => {
    if (!block || typeof block !== 'object') {
      number = 0
      listLevel = undefined
      previousWasNumbered = false
      separatedByCodeBlock = false
      return block
    }

    const item = block as Record<string, unknown>
    if (item._type === 'block' && item.listItem === 'number') {
      const level = typeof item.level === 'number' ? item.level : 1
      if (
        !previousWasNumbered &&
        !(separatedByCodeBlock && level === listLevel)
      ) {
        number = 0
      }

      number += 1
      listLevel = level
      previousWasNumbered = true
      separatedByCodeBlock = false
      return { ...item, _listStart: number }
    }

    if (
      item._type === 'codeBlock' &&
      (previousWasNumbered || separatedByCodeBlock)
    ) {
      previousWasNumbered = false
      separatedByCodeBlock = true
      return block
    }

    number = 0
    listLevel = undefined
    previousWasNumbered = false
    separatedByCodeBlock = false
    return block
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
      const first = value.children[0] as { _listStart?: number } | undefined
      return <ol start={first?._listStart ?? 1}>{children}</ol>
    },
  },
  types: {
    image: PortableTextImage,
    tweet: PortableTextTweet,
    codeBlock: PortableTextCodeBlock,
    download: PortableTextDownload,
    videoEmbed: PortableTextVideoEmbed,
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
  },
}

export function PostPortableText(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  components?: PortableTextComponents
}) {
  return (
    <PortableText
      value={preserveNumberingAcrossCodeBlocks(props.value) as typeof props.value}
      components={props.components ?? components}
    />
  )
}
