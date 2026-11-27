'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '~/components/shadcn/dialog'

type Announcement = {
  enabled?: boolean
  version?: string
  title?: string
  body?: string
  buttonText?: string
  buttonLink?: string
  imageUrl?: string
}

export function FirstVisitAnnouncement({
  announcement,
}: {
  announcement?: Announcement | null
}) {
  const [open, setOpen] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const close = React.useCallback(() => {
    setOpen(false)
    if (announcement?.version) {
      try {
        window.localStorage.setItem(
          'site-announcement-version',
          announcement.version
        )
      } catch {
        // Storage may be disabled.
      }
    }
  }, [announcement?.version])

  React.useEffect(() => {
    if (!announcement?.enabled || !announcement.version || !announcement.title) {
      return
    }

    try {
      if (
        window.localStorage.getItem('site-announcement-version') !==
        announcement.version
      ) {
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
        setOpen(true)
      }
    } catch {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      setOpen(true)
    }
  }, [announcement?.enabled, announcement?.version, announcement?.title])

  if (!announcement?.title) return null
  const buttonLink = announcement.buttonLink || ''
  const external = /^https?:\/\//i.test(buttonLink)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true)
        else close()
      }}
    >
      <DialogContent
        ref={dialogRef}
        tabIndex={-1}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          dialogRef.current?.focus()
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (previousFocusRef.current?.isConnected) {
            previousFocusRef.current.focus()
          }
          previousFocusRef.current = null
        }}
        className="max-h-[calc(100dvh-2rem)] max-w-xl gap-0 overflow-y-auto rounded-3xl border-zinc-700 bg-zinc-900 p-0 text-zinc-100 shadow-2xl shadow-black/40 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus-visible:shadow-none"
      >
        <button
          type="button"
          onClick={close}
          aria-label="关闭公告"
          className="group absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-zinc-950/70 text-zinc-300 transition group-hover:border-lime-400/60 group-hover:text-lime-300"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </span>
        </button>
        {announcement.imageUrl ? (
          <div
            className="relative h-40 w-full overflow-hidden bg-zinc-800 sm:h-[200px]"
            aria-busy={!imageLoaded}
          >
            {!imageLoaded ? (
              <div
                aria-hidden="true"
                className="absolute inset-0 animate-pulse bg-zinc-800"
              />
            ) : null}
            <Image
              src={announcement.imageUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, 560px"
              onLoad={() => setImageLoaded(true)}
              className={`object-cover object-center transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        ) : null}
        <div className="px-6 pb-6 pt-5">
          <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="size-1.5 rounded-full bg-lime-400" />站点公告
          </span>
          <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
            {announcement.title}
          </DialogTitle>
          {announcement.body ? (
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-zinc-300">
              {announcement.body}
            </p>
          ) : null}
          {buttonLink && announcement.buttonText ? (
            external ? (
              <a
                href={buttonLink}
                target="_blank"
                rel="noreferrer noopener"
                onClick={close}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300 active:scale-[0.98] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                {announcement.buttonText}
              </a>
            ) : (
              <Link
                href={buttonLink}
                onClick={close}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-lime-400 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300 active:scale-[0.98] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                {announcement.buttonText}
              </Link>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
