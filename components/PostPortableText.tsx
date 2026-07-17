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
import { PortableTextAudioEmbed } from '~/components/portable-text/PortableTextAudioEmbed'
import { PortableTextCodeBlock } from '~/components/portable-text/PortableTextCodeBlock'
import { PortableTextDownload } from '~/components/portable-text/PortableTextDownload'
import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { PortableTextTweet } from '~/components/portable-text/PortableTextTweet'
import { PortableTextVideoEmbed } from '~/components/portable-text/PortableTextVideoEmbed'

const textColorClass: Record<string, string> = {
  lime: 'text-lime-600 dark:text-lime-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  sky: 'text-sky-600 dark:text-sky-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
  violet: 'text-violet-600 dark:text-violet-400',
  zinc: 'text-zinc-500 dark:text-zinc-400',
}

const highlightClass: Record<string, string> = {
  lime: 'rounded-sm bg-lime-200/70 px-0.5 dark:bg-lime-400/20',
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
  types: {
    image: PortableTextImage,
    tweet: PortableTextTweet,
    codeBlock: PortableTextCodeBlock,
    download: PortableTextDownload,
    videoEmbed: PortableTextVideoEmbed,
    audioEmbed: PortableTextAudioEmbed,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <PeekabooLink href={value.href} rel={rel}>
          {children}
        </PeekabooLink>
      )
    },
    textColor: ({ children, value }) => {
      const cls = textColorClass[value?.color as string] || textColorClass.lime
      return <span className={cls}>{children}</span>
    },
    highlight: ({ children, value }) => {
      const cls =
        highlightClass[value?.color as string] || highlightClass.lime
      return <mark className={`${cls} text-inherit`}>{children}</mark>
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
      value={props.value}
      components={props.components ?? components}
    />
  )
}
