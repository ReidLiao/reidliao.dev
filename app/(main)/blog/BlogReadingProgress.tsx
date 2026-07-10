'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import React from 'react'

export function BlogReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-lime-500 dark:bg-lime-400"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
