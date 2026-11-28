'use client'

import React from 'react'

const visibleClasses =
  'focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[110] focus-visible:rounded-full focus-visible:bg-emerald-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:bg-emerald-400 dark:focus-visible:text-zinc-950 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900'

export function SkipLink() {
  const [tabNavigation, setTabNavigation] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') setTabNavigation(true)
    }
    const resetVisibility = () => setTabNavigation(false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', resetVisibility)
    window.addEventListener('pageshow', resetVisibility)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', resetVisibility)
      window.removeEventListener('pageshow', resetVisibility)
    }
  }, [])

  return (
    <a
      href="#main-content"
      onBlur={() => setTabNavigation(false)}
      className={`sr-only ${tabNavigation ? visibleClasses : 'focus-visible:outline-hidden focus-visible:shadow-none'}`}
    >
      跳到主内容
    </a>
  )
}
