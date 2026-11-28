import {
  PortableText,
  type PortableTextComponentProps,
  type PortableTextComponents,
} from '@portabletext/react'
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
  lime: 'text-emerald-700 dark:text-emerald-400',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  sky: 'text-sky-700 dark:text-sky-300',
  amber: 'text-amber-700 dark:text-amber-300',
  rose: 'text-rose-700 dark:text-rose-300',
  violet: 'text-violet-700 dark:text-violet-300',
  zinc: 'text-zinc-600 dark:text-zinc-400',
}

const textBackgroundClass: Record<string, string> = {
  lime: 'rounded-xs bg-emerald-50 px-0.5 text-emerald-700 dark:bg-emerald-400 dark:text-zinc-950',
  zinc: 'rounded-xs bg-zinc-200 px-0.5 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
}

// PortableTextComponentProps also contains renderNode; keep it server-side.
function PortableTextImageBlock({ value }: PortableTextComponentProps<unknown>) {
  return (
    <PortableTextImage
      value={value as Parameters<typeof PortableTextImage>[0]['value']}
    />
  )
}

function PortableTextTweetBlock({ value }: PortableTextComponentProps<unknown>) {
  return (
    <PortableTextTweet
      value={value as Parameters<typeof PortableTextTweet>[0]['value']}
    />
  )
}

function PortableTextCodeBlockServer({ value }: PortableTextComponentProps<unknown>) {
  return (
    <PortableTextCodeBlock
      value={value as Parameters<typeof PortableTextCodeBlock>[0]['value']}
    />
  )
}

function PortableTextDownloadBlock({ value }: PortableTextComponentProps<unknown>) {
  return (
    <PortableTextDownload
      value={value as Parameters<typeof PortableTextDownload>[0]['value']}
    />
  )
}

function PortableTextVideoEmbedBlock({ value }: PortableTextComponentProps<unknown>) {
  return (
    <PortableTextVideoEmbed
      value={value as Parameters<typeof PortableTextVideoEmbed>[0]['value']}
    />
  )
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
    image: PortableTextImageBlock,
    tweet: PortableTextTweetBlock,
    codeBlock: PortableTextCodeBlockServer,
    download: PortableTextDownloadBlock,
    videoEmbed: PortableTextVideoEmbedBlock,
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
          className="text-emerald-700 decoration-emerald-700/50 hover:text-emerald-800 hover:decoration-emerald-800 dark:text-emerald-400 dark:decoration-emerald-400/50 dark:hover:text-emerald-400 dark:hover:decoration-emerald-400"
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
    textBackground: ({ children, value }) => {
      const cls =
        textBackgroundClass[value?.color as string] || textBackgroundClass.lime
      return <span className={cls}>{children}</span>
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
      value={preserveNumberingAcrossCodeBlocks(props.value)}
      components={props.components ?? components}
    />
  )
}
