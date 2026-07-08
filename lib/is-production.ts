import { env } from '~/env.mjs'

export const isProduction = env.NODE_ENV === 'production'
