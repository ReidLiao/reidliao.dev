import Link from 'next/link'
import React, { Suspense } from 'react'

import { Container } from '~/components/ui/Container'
import { navigationItems } from '~/config/nav'

import { FooterLiveStats } from './FooterLiveStats'
import { Newsletter } from './Newsletter'

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div data-footer-newsletter className="mx-auto mb-10 max-w-md">
              <Suspense fallback={<Newsletter subCount="6" variant="footer" />}>
                <Newsletter subCount="6" variant="footer" />
              </Suspense>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
                <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 md:justify-start">
                  <span>&copy; {new Date().getFullYear()} 青柠夜栈</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    </span>
                    <span>
                      Crafted with{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                        Next.js
                      </span>{' '}
                      &amp;{' '}
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                        Tailwind
                      </span>
                    </span>
                  </span>
                </p>
                <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {navigationItems.map(({ href, text }) => (
                    <Link
                      key={href}
                      href={href}
                      className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      {text}
                    </Link>
                  ))}
                </nav>
              </div>
              <FooterLiveStats />
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
