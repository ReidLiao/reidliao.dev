'use client'

import React from 'react'

import { ClipboardCheckIcon, ClipboardDataIcon } from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'
import { ElegantTooltip } from '~/components/ui/Tooltip'

const DeferredSyntaxHighlighter = React.lazy(
  () => import('./PortableTextCodeSyntax')
)

function PlainCode({ language, code }: { language: string; code: string }) {
  return (
    <pre className={`prismjs language-${language}`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  )
}

function CodeSyntaxOnView({
  language,
  code,
}: {
  language: string
  code: string
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = React.useState(false)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setIsNearViewport(true)
        observer.disconnect()
      },
      { rootMargin: '320px 0px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {isNearViewport ? (
        <React.Suspense fallback={<PlainCode language={language} code={code} />}>
          <DeferredSyntaxHighlighter language={language} code={code} />
        </React.Suspense>
      ) : (
        <PlainCode language={language} code={code} />
      )}
    </div>
  )
}

export function PortableTextCodeBlock({
  value,
}: {
  value: {
    _key: string
    language: string
    code: string
    filename?: string
  }
}) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const onClickCopy = React.useCallback(() => {
    navigator.clipboard
      .writeText(value.code)
      .then(() => {
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 3000)
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
          <span className="font-mono text-[11px] tracking-wide text-zinc-600 dark:text-zinc-400">
            {value.language || 'code'}
          </span>
        )}
        <div className="flex-1" />
        <ElegantTooltip content="复制">
          <button
            type="button"
            className="shrink-0 text-zinc-600 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
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

      <div className="max-w-full overflow-x-auto overscroll-x-contain [&_pre]:!text-[14px] md:[&_pre]:!text-[14.5px] xl:[&_pre]:!text-[15px] [&_code]:!text-[14px] md:[&_code]:!text-[14.5px] xl:[&_code]:!text-[15px]">
        <CodeSyntaxOnView language={value.language} code={value.code} />
      </div>
    </div>
  )
}
