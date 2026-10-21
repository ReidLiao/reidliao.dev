'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

export function FloatingContact() {
  const [open, setOpen] = React.useState(false)
  const [wechatOpen, setWechatOpen] = React.useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <div className="fixed bottom-20 right-5 z-40 sm:bottom-24 sm:right-8">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute bottom-14 right-0 flex flex-col items-end gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <AnimatePresence>
              {wechatOpen ? (
                <motion.div
                  role="dialog"
                  aria-label="微信公众号二维码"
                  className="mb-1 w-[232px] min-w-[232px] shrink-0 rounded-2xl border border-zinc-200 bg-white p-2.5 text-center shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
                  initial={{ opacity: 0, scale: 0.96, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 4 }}
                >
                  <div className="mx-auto w-[212px] shrink-0 rounded-xl bg-white p-1.5">
                    <Image
                      src="/wechat-qrcode.jpg"
                      alt="微信公众号二维码"
                      width={200}
                      height={200}
                      className="block h-[200px] w-[200px] max-w-none shrink-0 aspect-square rounded-lg object-contain"
                    />
                  </div>
                  <p className="mt-2 whitespace-nowrap text-xs text-zinc-600 dark:text-zinc-300">
                    微信扫一扫关注公众号
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <a
              href="mailto:hi@reidliao.dev"
              aria-label="发送邮件"
              title="发送邮件"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-600 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition hover:border-lime-500/50 hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-white/10 dark:hover:border-lime-400/50 dark:hover:text-lime-300 dark:focus-visible:ring-lime-400"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              type="button"
              aria-label="微信公众号二维码"
              title="微信公众号二维码"
              aria-expanded={wechatOpen}
              onClick={() => setWechatOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-600 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition hover:border-lime-500/50 hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-white/10 dark:hover:border-lime-400/50 dark:hover:text-lime-300 dark:focus-visible:ring-lime-400"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[19px] w-[19px]"
                fill="currentColor"
              >
                <path d="M9.8 4.2c-4.1 0-7.4 2.7-7.4 6.1 0 1.9 1 3.5 2.7 4.6l-.7 2.4 3-1.4c.8.2 1.6.4 2.4.4 4.1 0 7.4-2.7 7.4-6.1s-3.3-6-7.4-6Zm-2.5 7a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm5 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" />
                <path d="M21.7 13.1c0-2.8-2.6-5.1-5.9-5.4.5.9.8 1.8.8 2.8 0 3.4-3.2 6.2-7.3 6.6 1.1 1.5 3.1 2.5 5.4 2.5.7 0 1.4-.1 2.1-.3l2.4 1.1-.6-2c1.9-1.1 3.1-3 3.1-5.3Zm-6.8 1a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm3.7 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        aria-label="联系站长"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value)
          setWechatOpen(false)
        }}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-600 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition hover:border-lime-500/50 hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-white/10 dark:hover:border-lime-400/50 dark:hover:text-lime-300 dark:focus-visible:ring-lime-400"
      >
        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
        </svg>
      </button>
    </div>
  )
}
