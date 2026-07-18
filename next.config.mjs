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
    // Docker 自建环境下 /_next/image 常因 remotePatterns/出网失败返回 403，
    // 与文章页一致：Sanity CDN 直链，避免优化代理。
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  experimental: {
    taint: true,
  },

  redirects() {
    return [
      {
        source: '/projects',
        destination: '/vps',
        permanent: true,
      },
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
        destination: 'https://space.bilibili.com/692964587',
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
