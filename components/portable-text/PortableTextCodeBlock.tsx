'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { ClipboardCheckIcon, ClipboardDataIcon } from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'
import { ElegantTooltip } from '~/components/ui/Tooltip'

export function PortableTextCodeBlock({
  value,
}: PortableTextComponentProps<{
  _key: string
  language: string
  code: string
  filename?: string
}>) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const onClickCopy = React.useCallback(() => {
    navigator.clipboard
      .writeText(value.code)
      .then(() => {
        setHasCopied(true)
        setTimeout(() => {
          setHasCopied(false)
        }, 3000)
      })
      .catch(() => {
        console.error('Failed to copy code block')
      })
  }, [value.code])

  return (
    <div
      data-blockid={value._key}
      data-filename={value.filename}
      className="group relative my-6 max-w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-700/50 dark:bg-zinc-900/60 md:rounded-3xl"
    >
      <ClientOnly>
        <Commentable className="z-30" blockId={value._key} />
      </ClientOnly>

      <div className="flex items-center gap-2 border-b border-zinc-200/70 px-3 py-2 dark:border-zinc-700/50 sm:px-4">
        {value.filename ? (
          <span className="min-w-0 truncate font-mono text-xs font-medium text-lime-700 dark:text-lime-300">
            {value.filename}
          </span>
        ) : (
          <span className="font-mono text-[11px] tracking-wide text-zinc-400 dark:text-zinc-500">
            {value.language || 'code'}
          </span>
        )}
        <div className="flex-1" />
        <ElegantTooltip content="复制">
          <button
            type="button"
            className="shrink-0 text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            onClick={onClickCopy}
            aria-label="复制代码"
          >
            {hasCopied ? (
              <ClipboardCheckIcon className="h-4 w-4" />
            ) : (
              <ClipboardDataIcon className="h-4 w-4" />
            )}
          </button>
        </ElegantTooltip>
      </div>

      <div className="max-w-full overflow-x-auto overscroll-x-contain">
        <ClientOnly>
          <SyntaxHighlighter
            language={value.language}
            showLineNumbers
            useInlineStyles={false}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: 'transparent',
              maxWidth: '100%',
            }}
            codeTagProps={{
              style: {},
              className: `language-${value.language}`,
            }}
            lineNumberStyle={{
              minWidth: '2.25em',
              paddingRight: '1em',
              opacity: 0.35,
            }}
          >
            {value.code}
          </SyntaxHighlighter>
        </ClientOnly>
      </div>
    </div>
  )
}
