export const seo = {
  title: 'Reidliao.dev | 开发者、运维工程师、内容创作者',
  description:
    '我是 Reidliao.dev，在云端与系统底层探索的创作者。本站专注于全栈网站搭建、Docker 容器化应用与系统运维实战，不定期带来硬核技术干货、靠谱的云服务推荐以及优质软件下载分享。保持好奇，折腾不止。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://reidliao.dev'
      : 'http://localhost:3000'
  ),
} as const
