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

/**
 * 有序列表跨图片 / 代码块续编。
 * Portable Text 里列表不是一个整体：连续的有序项才会被渲染成一个 <ol>，
 * 中间插一个图片或代码块就会断成两个 <ol>，后一段默认又从 1 开始。
 * 这里先按原文顺序扫一遍：只有当两段有序列表之间只隔了图片 / 代码块时，
 * 后一段才用 <ol start="上一段编到的号 + 1"> 续编；中间隔了段落、标题、
 * 下载块等其他内容时，重新从 1 开始，避免不相关的列表串号。
 * 嵌套项（level > 1）不计入顶层编号，也不打断当前列表。
 * 返回值以每段首个列表项的 _key 为键，渲染时按 _key 查起始号，
 * 不依赖渲染顺序，嵌套列表查不到时自然回落到默认的 1。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortableBlockLike = any

const CONTINUABLE_BLOCK_TYPES = new Set(['image', 'codeBlock'])

function isTopLevelNumberItem(block: PortableBlockLike): boolean {
  return (
    block?._type === 'block' &&
    block?.listItem === 'number' &&
    (block?.level ?? 1) === 1
  )
}

function getNumberListStarts(blocks: PortableBlockLike[]): Map<string, number> {
  const starts = new Map<string, number>()
  let count = 0
  let onlyContinuableSinceLastList = false
  let inList = false
  for (const block of blocks) {
    // 嵌套项属于当前列表内部，不计号、不断号。
    if (block?.listItem && (block?.level ?? 1) > 1) {
      continue
    }
    if (isTopLevelNumberItem(block)) {
      if (!inList) {
        const start =
          onlyContinuableSinceLastList && count > 0 ? count + 1 : 1
        if (block?._key) {
          starts.set(block._key, start)
        }
        if (!onlyContinuableSinceLastList || count === 0) {
          count = 0
        }
        inList = true
      }
      count += 1
      continue
    }
    if (inList) {
      inList = false
      onlyContinuableSinceLastList = CONTINUABLE_BLOCK_TYPES.has(block?._type)
    } else {
      onlyContinuableSinceLastList =
        onlyContinuableSinceLastList &&
        CONTINUABLE_BLOCK_TYPES.has(block?._type)
    }
  }
  return starts
}

function getListStartKey(
  value: PortableBlockLike,
  children: PortableBlockLike
): string | undefined {
  const first = value?.children?.[0]
  if (first) {
    if (typeof first._key === 'string') {
      return first._key
    }
    if (typeof first.value?._key === 'string') {
      return first.value._key
    }
    const nestedFirst = first.children?.[0]
    if (typeof nestedFirst?._key === 'string') {
      return nestedFirst._key
    }
  }
  // 兜底：默认列表项渲染会在 <li> 上带 data-blockid（即原块 _key）。
  const childArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : []
  const firstChild = childArray[0]
  const childKey =
    firstChild?.props?.['data-blockid'] ?? firstChild?.props?.value?._key
  if (typeof childKey === 'string') {
    return childKey
  }
  return undefined
}

function createNumberListComponent(starts: Map<string, number>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function NumberList({ children, value }: any) {
    const start = starts.get(getListStartKey(value, children) ?? '')
    if (start && start > 1) {
      return <ol start={start}>{children}</ol>
    }
    return <ol>{children}</ol>
  }
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
  const blocks = React.useMemo(
    () =>
      (Array.isArray(props.value)
        ? props.value
        : props.value
          ? [props.value]
          : []) as PortableBlockLike[],
    [props.value]
  )
  const numberListStarts = React.useMemo(
    () => getNumberListStarts(blocks),
    [blocks]
  )
  const mergedComponents = React.useMemo(() => {
    const base = props.components ?? components
    // 调用方如果明确自定义了有序列表渲染，尊重它；否则注入续编逻辑。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((base as any)?.list?.number) {
      return base
    }
    return {
      ...base,
      list: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(base as any)?.list,
        number: createNumberListComponent(numberListStarts),
      },
    }
  }, [props.components, numberListStarts])
  return <PortableText value={props.value} components={mergedComponents} />
}
