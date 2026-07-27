export type WritingIcon = {
  emoji: string
  label: string
  hint: string
}

export type WritingIconGroup = {
  id: string
  title: string
  emoji: string
  description: string
  icons: WritingIcon[]
}

/** 写作常用图标：在 Studio 正文编辑器中点选插入 / 复制 */
export const writingIconGroups: WritingIconGroup[] = [
  {
    id: 'devops',
    title: '容器与服务器运维',
    emoji: '🐳',
    description: 'Docker、VPS、部署与存储相关标记',
    icons: [
      {
        emoji: '🐳',
        label: '容器/运维',
        hint: '容器与服务器运维总览',
      },
      {
        emoji: '🐧',
        label: 'Linux/内核',
        hint: 'Linux 系统级操作或脚本',
      },
      {
        emoji: '🖥️',
        label: '服务器/主机',
        hint: '云服务器实例或 VPS 操作',
      },
      {
        emoji: '📦',
        label: '容器/打包',
        hint: 'Docker 镜像、容器管理或包管理器',
      },
      {
        emoji: '🚢',
        label: '部署/发布',
        hint: '项目上线、推送或 CI 步骤',
      },
      {
        emoji: '🗄️',
        label: '数据库/存储',
        hint: 'Prisma、MySQL、Redis 或挂载卷',
      },
      {
        emoji: '🛠️',
        label: '工具/构建',
        hint: '编译过程或环境依赖安装',
      },
    ],
  },
  {
    id: 'network',
    title: '网络与域名',
    emoji: '🌐',
    description: '路由、Nginx、DNS、证书与代理',
    icons: [
      {
        emoji: '🌐',
        label: '网络/域名',
        hint: 'DNS 解析、域名绑定',
      },
      {
        emoji: '🔀',
        label: '路由/分流',
        hint: '流量分流规则或代理出站策略',
      },
      {
        emoji: '📡',
        label: '节点/连接',
        hint: '网络连通性或端口监听',
      },
      {
        emoji: '🛡️',
        label: '安全/证书',
        hint: 'SSL、HTTPS 或防火墙',
      },
      {
        emoji: '☁️',
        label: 'CDN/云端',
        hint: 'CDN 缓存或云服务节点',
      },
      {
        emoji: '🔌',
        label: '端口/网关',
        hint: '反向代理端口映射或内网穿透',
      },
    ],
  },
  {
    id: 'web',
    title: '现代 Web 开发',
    emoji: '💻',
    description: '前端、Node.js、SEO 与本地开发',
    icons: [
      {
        emoji: '💻',
        label: '终端/脚本',
        hint: '命令行或 Shell 脚本',
      },
      {
        emoji: '🚀',
        label: '性能/启动',
        hint: '服务启动（如 PM2）或性能优化',
      },
      {
        emoji: '⚛️',
        label: '现代栈/引擎',
        hint: 'React / Next.js 等前端框架',
      },
      {
        emoji: '⚡',
        label: '加速/缓存',
        hint: '页面加载速度或缓存命中',
      },
      {
        emoji: '🔍',
        label: 'SEO/检索',
        hint: '搜索引擎元数据或爬虫配置',
      },
      {
        emoji: '🍎',
        label: 'macOS/本地',
        hint: '仅限本地开发环境的操作',
      },
    ],
  },
  {
    id: 'status',
    title: '状态与排错日志',
    emoji: '🚦',
    description: 'SOP、执行结果与排错标记',
    icons: [
      {
        emoji: '✅',
        label: '成功/完成',
        hint: '操作成功或环境检查通过',
      },
      {
        emoji: '❌',
        label: '失败/错误',
        hint: '崩溃日志或 Error 报错',
      },
      {
        emoji: '⚠️',
        label: '警告/注意',
        hint: '高危操作前提示',
      },
      {
        emoji: '🔄',
        label: '重启/重载',
        hint: '平滑重启或守护进程重启',
      },
      {
        emoji: '🐛',
        label: 'Bug/排错',
        hint: '排错过程与解决方案',
      },
      {
        emoji: '📝',
        label: '记录/日志',
        hint: '系统日志或说明文本',
      },
    ],
  },
]
