import { defineArrayMember, defineField, defineType } from 'sanity'

import { BlockContentInput } from '~/sanity/components/BlockContentInput'
import { ColorSwatchInput } from '~/sanity/components/ColorSwatchInput'
import { HighlightMarkIcon, TextColorMarkIcon } from '~/sanity/components/MarkIcons'
import { Tweet } from '~/sanity/components/Tweet'

const semanticColors = [
  { title: '青柠', value: 'lime' },
  { title: '翠绿', value: 'emerald' },
  { title: '天蓝', value: 'sky' },
  { title: '琥珀', value: 'amber' },
  { title: '玫红', value: 'rose' },
  { title: '紫色', value: 'violet' },
]

const platformList = [
  { title: '通用', value: 'any' },
  { title: 'macOS', value: 'macos' },
  { title: 'Windows', value: 'windows' },
  { title: 'Linux', value: 'linux' },
  { title: 'Android', value: 'android' },
  { title: 'iOS', value: 'ios' },
]

/** Only numeric versions get a `v` prefix; names/editions stay as-is. */
const formatPreviewVersion = (version?: unknown) => {
  if (!version) return null
  const text = String(version).trim()
  if (!text) return null
  if (/^v\d/i.test(text)) return text
  if (/^\d+(\.\d+)*([-.+][0-9A-Za-z.-]+)?$/.test(text)) return `v${text}`
  return text
}

/** Separate type — avoid nested anonymous objects / reserved `file` name crashing Studio. */
export const downloadItem = defineType({
  name: 'downloadItem',
  title: '下载版本',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      title: '平台',
      description: '用于前台自动匹配与版本切换标签',
      options: { list: platformList, layout: 'radio' },
      initialValue: 'any',
    }),
    defineField({
      name: 'version',
      type: 'string',
      title: '版本',
      description:
        '例如 2.0；多版本时作为切换标签。系统名/版本（如 Windows XP Professional）直接写，不要带 v 前缀，前台只给纯数字版本号加 v',
    }),
    defineField({
      name: 'arch',
      type: 'string',
      title: '架构',
      description: '例如 x86、x64；系统镜像必填，普通软件可留空',
    }),
    defineField({
      name: 'language',
      type: 'string',
      title: '语言',
      description: '例如 简体中文；系统镜像必填，普通软件可留空',
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: '下载链接',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: '大小',
      description: '例如 128 MB（可选）',
    }),
    defineField({
      name: 'checksum',
      type: 'string',
      title: '校验和',
      description: '可选',
    }),
    // 旧字段：曾与标题重复，已废弃
    defineField({
      name: 'label',
      type: 'string',
      title: '显示名称（旧）',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      version: 'version',
      platform: 'platform',
      arch: 'arch',
      language: 'language',
      url: 'url',
    },
    prepare({ version, platform, arch, language, url }) {
      const plat =
        platform && platform !== 'any'
          ? platformList.find((p) => p.value === platform)?.title || platform
          : null
      const ver = formatPreviewVersion(version)
      return {
        title:
          [plat, ver, arch, language].filter(Boolean).join(' · ') || '下载项',
        subtitle: url,
      }
    },
  },
})

export default defineType({
  title: '块级富文本',
  name: 'blockContent',
  type: 'array',
  validation: (Rule) => Rule.custom((value) => {
    if (!Array.isArray(value)) return true
    const primaryCount = value.filter((block: unknown) =>
      Boolean(block && typeof block === 'object' && '_type' in block && block._type === 'linkButton' && 'style' in block && block.style === 'primary')
    ).length
    return primaryCount <= 1 || '一篇文章里最多放一个主按钮'
  }),
  components: {
    input: BlockContentInput,
  },
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      styles: [
        { title: '正文', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: '引用', value: 'blockquote' },
      ],
      lists: [
        { title: '无序列表', value: 'bullet' },
        { title: '有序列表', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: '加粗', value: 'strong' },
          { title: '斜体', value: 'em' },
          { title: '下划线', value: 'underline' },
          { title: '删除线', value: 'strike-through' },
          { title: '代码', value: 'code' },
          { title: '键盘按键', value: 'kbd' },
        ],
        annotations: [
          {
            title: '链接',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: '链接',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            title: '文字颜色',
            name: 'textColor',
            icon: TextColorMarkIcon,
            type: 'object',
            fields: [
              {
                name: 'color',
                title: '颜色',
                type: 'string',
                options: { list: [...semanticColors, { title: '中灰', value: 'zinc' }] },
                components: { input: ColorSwatchInput },
                initialValue: 'lime',
              },
            ],
          },
          {
            title: '高亮底色',
            name: 'highlight',
            icon: HighlightMarkIcon,
            type: 'object',
            fields: [
              {
                name: 'color',
                title: '颜色',
                type: 'string',
                options: { list: semanticColors },
                components: { input: ColorSwatchInput },
                initialValue: 'lime',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: '图片',
      options: { hotspot: true },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文本',
        },
        {
          name: 'label',
          type: 'string',
          title: '标注',
        },
      ],
    }),
    defineArrayMember({
      type: 'object', name: 'accordion', title: '手风琴',
      fields: [defineField({ name: 'items', title: '项目', type: 'array', of: [{ type: 'object', fields: [
        defineField({ name: 'title', title: '标题', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'body', title: '内容', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
      ] }] })],
    }),
    defineArrayMember({
      type: 'object', name: 'callout', title: '提示 / 警告',
      fields: [
        defineField({ name: 'title', title: '标题', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'body', title: '正文', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
        defineField({ name: 'icon', title: '图标', type: 'string', options: { list: [{ title: '提示', value: 'info' }, { title: '注意', value: 'alert' }, { title: '禁止', value: 'stop' }, { title: '说明', value: 'note' }] }, initialValue: 'info' }),
        defineField({ name: 'tone', title: '颜色', type: 'string', options: { list: [{ title: '青柠', value: 'lime' }, { title: '琥珀', value: 'amber' }, { title: '玫红', value: 'rose' }, { title: '天蓝', value: 'sky' }, { title: 'Zinc', value: 'zinc' }] }, initialValue: 'lime' }),
      ],
    }),
    defineArrayMember({
      type: 'object', name: 'comparisonTable', title: '表格',
      fields: [
        defineField({ name: 'caption', title: '表格标题', type: 'string' }),
        defineField({ name: 'headers', title: '列标题', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.required().min(1) }),
        defineField({ name: 'rows', title: '行', type: 'array', of: [{ type: 'object', fields: [defineField({ name: 'cells', title: '单元格', type: 'array', of: [{ type: 'string' }] })] }] }),
      ],
    }),
    defineArrayMember({
      type: 'object', name: 'timeline', title: '时间轴',
      fields: [defineField({ name: 'items', title: '记录', type: 'array', of: [{ type: 'object', fields: [
        defineField({ name: 'date', title: '日期', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'title', title: '标题', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'description', title: '一句话说明', type: 'string', validation: (Rule) => Rule.required() }),
      ] }] })],
    }),
    defineArrayMember({
      type: 'object', name: 'linkButton', title: '链接按钮',
      fields: [
        defineField({ name: 'text', title: '按钮文字', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'href', title: '链接', type: 'string', validation: (Rule) => Rule.required().custom((value) => !value || (/^(https?:\/\/|\/)/i.test(value) && !value.startsWith('//')) ? true : '请填写站内路径或 http/https 链接') }),
        defineField({ name: 'style', title: '样式', type: 'string', options: { list: [{ title: '主按钮（青柠）', value: 'primary' }, { title: '次按钮（白底描边）', value: 'secondary' }] }, initialValue: 'primary' }),
        defineField({ name: 'isPromotion', title: '推广链接', type: 'boolean', initialValue: false }),
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'tweet',
      title: '推文',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'id',
          type: 'string',
          title: '推文 ID',
        },
      ],
      components: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preview: Tweet as any,
      },
      preview: {
        select: {
          id: 'id',
        },
      },
    }),
    defineArrayMember({
      type: 'code',
      name: 'codeBlock',
      title: '代码块',
      options: {
        withFilename: true,
        // 仅提供前台已注册高亮的语言，避免出现「选了但不高亮」的情况。
        languageAlternatives: [
          { title: 'Bash / Shell', value: 'bash' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JSX', value: 'jsx' },
          { title: 'TSX', value: 'tsx' },
          { title: 'JSON', value: 'json' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Dockerfile', value: 'docker' },
          { title: 'Nginx', value: 'nginx' },
          { title: 'Python', value: 'python' },
          { title: 'SQL', value: 'sql' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'HTML / XML', value: 'markup' },
          { title: 'CSS', value: 'css' },
          { title: 'SCSS', value: 'scss' },
          { title: 'Go', value: 'go' },
          { title: 'Diff', value: 'diff' },
          { title: 'TOML', value: 'toml' },
          { title: 'INI', value: 'ini' },
        ],
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'download',
      title: '下载块',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'title',
          type: 'string',
          title: '资源名称',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'extractCode',
          type: 'string',
          title: '提取码',
          description: '网盘提取码（可选，前台一键复制）',
        },
        {
          name: 'note',
          type: 'text',
          rows: 2,
          title: '备注',
          description: '安装说明、注意事项等（整组共用；提取码请用上方字段）',
        },
        {
          name: 'updatedAt',
          type: 'date',
          title: '更新日期',
          description: '资源最近更新时间（可选，前台会显示）',
          options: { dateFormat: 'YYYY-MM-DD' },
        },
        {
          name: 'files',
          type: 'array',
          title: '下载版本',
          description: '可添加多个平台/版本；前台可下拉选择',
          of: [{ type: 'downloadItem' }],
        },
        // 兼容旧单链接字段
        {
          name: 'url',
          type: 'url',
          title: '下载链接（旧）',
          hidden: true,
        },
        {
          name: 'version',
          type: 'string',
          title: '版本（旧）',
          hidden: true,
        },
        {
          name: 'platform',
          type: 'string',
          title: '平台（旧）',
          hidden: true,
        },
        {
          name: 'size',
          type: 'string',
          title: '大小（旧）',
          hidden: true,
        },
        {
          name: 'checksum',
          type: 'string',
          title: '校验和（旧）',
          hidden: true,
        },
      ],
      preview: {
        select: {
          title: 'title',
          files: 'files',
          version: 'version',
        },
        prepare({ title, files, version }) {
          const count = Array.isArray(files) ? files.length : version ? 1 : 0
          return {
            title: title || '下载块',
            subtitle: count ? `${count} 个下载项` : '未添加版本',
          }
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: '视频嵌入',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'url',
          type: 'url',
          title: '视频链接',
          description: '支持 YouTube、Bilibili BV/av/播放器地址与直链 mp4；不支持内嵌的平台链接会保留为原视频入口。',
          validation: (Rule) =>
            Rule.required().uri({ scheme: ['http', 'https'] }),
        },
        {
          name: 'title',
          type: 'string',
          title: '标题（可选）',
        },
      ],
      preview: {
        select: { title: 'title', url: 'url' },
        prepare({ title, url }) {
          return {
            title: title || '视频嵌入',
            subtitle: url,
          }
        },
      },
    }),
  ],
})
