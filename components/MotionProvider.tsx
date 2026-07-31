'use client'

import { MotionConfig } from 'framer-motion'

/**
 * 让全站 framer-motion 动画尊重系统「减少动态效果」偏好：
 * reducedMotion="user" 时会自动跳过位移/缩放类动画（保留必要的透明度过渡）。
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
