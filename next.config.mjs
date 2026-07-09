/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      }
    ],
  },

  experimental: {
    taint: true,
  },

  redirects() {
    return [
      {
        source: '/twitter',
        destination: 'https://x.com/reidliao',
        permanent: true,
      },
      {
        source: '/x',
        destination: 'https://x.com/reidliao',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/@LiaoReid',
        permanent: true,
      },
      {
        source: '/bilibili',
        destination: 'https://www.bilibili.com',
        permanent: true,
      },
      {
        source: '/tg',
        destination: 'https://t.me/ReidLiao',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.com/ReidLiao/reidliao.dev',
        permanent: true,
      },
    ]
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
      },
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
    ]
  },
}

export default nextConfig
