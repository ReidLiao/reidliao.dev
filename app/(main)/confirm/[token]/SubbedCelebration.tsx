'use client'

import React from 'react'
import { useReward } from 'react-rewards'

export function SubbedCelebration() {
  const { reward } = useReward('subbed-celebration', 'confetti', {
    position: 'absolute',
    angle: 90,
    startVelocity: 32,
    elementCount: 120,
    spread: 90,
    elementSize: 8,
    lifetime: 320,
  })

  React.useEffect(() => {
    const timer = setTimeout(() => reward(), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="pb-16" aria-hidden />

}
