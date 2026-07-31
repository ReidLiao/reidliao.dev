'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import toml from 'react-syntax-highlighter/dist/esm/languages/prism/toml'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'

import { ClipboardCheckIcon, ClipboardDataIcon } from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'
import { ElegantTooltip } from '~/components/ui/Tooltip'

// 只注册常用语言，避免把整个 Prism 语言库打进客户端 bundle。
// 未注册的语言会安全退化为纯文本（无高亮）。
const languages: Record<string, unknown> = {
  bash,
  css,
  diff,
  docker,
  go,
  ini,
  javascript,
  json,
  jsx,
  markdown,
  markup,
  nginx,
  python,
  scss,
  sql,
  toml,
  tsx,
  typescript,
  yaml,
}
// 常见别名，兼容 Sanity 里可能写的语言标识。
const aliases: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  yml: 'yaml',
  dockerfile: 'docker',
  html: 'markup',
  xml: 'markup',
  md: 'markdown',
}
for (const [name, lang] of Object.entries(languages)) {
  SyntaxHighlighter.registerLanguage(name, lang as never)
}
for (const [alias, target] of Object.entries(aliases)) {
  if (languages[target]) {
    SyntaxHighlighter.registerLanguage(alias, languages[target] as never)
  }
}

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
          <span className="min-w-0 truncate font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300">
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

      <div className="max-w-full overflow-x-auto overscroll-x-contain [&_pre]:!text-[13px] md:[&_pre]:!text-sm [&_code]:!text-[13px] md:[&_code]:!text-sm">
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
