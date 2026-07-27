export const seo = {
  title: 'Reidliao.dev | 开发者、架构师、软件迷、自建者',
  description:
    '我是 Reidliao.dev 的搭建与维护者，专注全栈建站、Docker 自建与系统运维实践。分享踩过坑的笔记、自用云服务与软件工具。保持好奇，折腾不止。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://reidliao.dev'
      : 'http://localhost:3000'
  ),
} as const
