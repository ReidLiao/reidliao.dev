'use client'

import React from 'react'

const fadeClass =
  'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-gradient-to-l after:from-zinc-50 after:to-transparent dark:after:from-primary-900 sm:after:hidden'

export function CategoryScrollFade({
  children,
}: {
  children: React.ReactNode
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateFade = React.useCallback(() => {
    const element = scrollRef.current
    if (!element) return

    const maxScrollLeft = element.scrollWidth - element.clientWidth
    setCanScrollRight(maxScrollLeft - element.scrollLeft > 1)
  }, [])

  React.useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    updateFade()
    window.addEventListener('resize', updateFade)

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateFade)
    }

    const resizeObserver = new ResizeObserver(updateFade)
    resizeObserver.observe(element)
    if (element.firstElementChild) resizeObserver.observe(element.firstElementChild)

    return () => {
      window.removeEventListener('resize', updateFade)
      resizeObserver.disconnect()
    }
  }, [updateFade])

  return (
    <div
      className={`relative min-w-0 flex-1 ${canScrollRight ? fadeClass : ''}`}
    >
      <div
        ref={scrollRef}
        onScroll={updateFade}
        className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain py-1 pl-1 pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  )
}
