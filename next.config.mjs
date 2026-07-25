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
    // Docker 自建：走自定义 loader，把请求转到同源 /api/img 磁盘缓存，
    // 让 Sanity 图片按 srcSet 尺寸取，移动端不再拉桌面尺寸。
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
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
