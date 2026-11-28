'use client'

import { clsxm } from '@zolplay/utils'
import dynamic from 'next/dynamic'
import React from 'react'

import { TiltedSendIcon } from '~/assets'
import { Button } from '~/components/ui/Button'

const NewsletterReward = dynamic(() => import('./NewsletterReward'), {
  ssr: false,
})

const formId = '5108903'
const emailPattern = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

export function Newsletter({
  subCount,
  variant = 'card',
}: {
  subCount?: string
  variant?: 'card' | 'footer'
}) {
  const isFooter = variant === 'footer'
  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const [submitError, setSubmitError] = React.useState('')

  React.useEffect(() => {
    if (!isSubscribed) return
    const timer = window.setTimeout(() => setIsSubscribed(false), 60000)
    return () => window.clearTimeout(timer)
  }, [isSubscribed])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const normalizedEmail = email.trim()
    if (
      !normalizedEmail ||
      !emailPattern.test(normalizedEmail)
    ) {
      setEmailError('邮箱地址不正确')
      return
    }

    setEmailError('')
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email: normalizedEmail, formId } }),
      })

      if (!response.ok) {
        setSubmitError('订阅暂时无法完成，请稍后再试。')
        return
      }

      setEmail('')
      setIsSubscribed(true)
    } catch {
      setSubmitError('网络暂时不可用，请检查连接后重试。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      noValidate
      className={clsxm(
        'relative transition-opacity',
        'rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40',
        isFooter && 'bg-white shadow-xs dark:bg-zinc-900',
        isSubmitting && 'pointer-events-none opacity-70'
      )}
      onSubmit={onSubmit}
    >
      <input type="hidden" name="formId" value={formId} />
      <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TiltedSendIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">邮件订阅</span>
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-sm">
        有新的建站折腾、运维笔记或工具分享时，我会给你发一封邮件。内容精简，每月至多一封，随时可取消。
        {subCount ? (
          <>
            {' '}
            已有 <span className="font-medium">{subCount}</span> 位订阅者。
          </>
        ) : null}
      </p>
      {isSubscribed ? (
        <p
          className="mt-6 h-10 text-center text-lg text-zinc-700 dark:text-zinc-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          请查收订阅确认邮件 ✉️
        </p>
      ) : (
        <div className="mt-6 flex h-10">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError('')
            }}
            placeholder="你的邮箱"
            aria-label="电子邮箱"
            aria-invalid={emailError ? 'true' : undefined}
            aria-describedby={emailError ? 'newsletter-email-error' : undefined}
            autoComplete="email"
            required
            className={clsxm(
              'min-w-0 appearance-none rounded-lg border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:border-lime-500 focus:outline-hidden focus:ring-4 focus:ring-lime-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-lime-400/50 dark:focus:ring-lime-400/5 sm:text-sm',
              'flex-auto'
            )}
          />
          <Button
            type="submit"
            className={clsxm(
              'ml-2 flex-none',
              isFooter &&
                'bg-black font-semibold text-white hover:bg-zinc-800 active:bg-black active:text-white/70 dark:bg-black dark:text-white dark:hover:bg-zinc-800'
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中…' : '订阅'}
          </Button>
        </div>
      )}
      {isSubscribed ? <NewsletterReward /> : null}
      {emailError ? (
        <p
          id="newsletter-email-error"
          role="alert"
          aria-live="assertive"
          className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
        >
          {emailError}
        </p>
      ) : null}
      {submitError ? (
        <p role="alert" aria-live="assertive" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {submitError}
        </p>
      ) : null}
    </form>
  )
}
