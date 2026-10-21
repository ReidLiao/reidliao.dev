import { Manrope } from 'next/font/google'

const sansFont = Manrope({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap',
})

export { sansFont }
