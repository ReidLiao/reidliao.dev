import { defineArrayMember, defineField, defineType } from 'sanity'

import { Tweet } from '~/sanity/components/Tweet'

const platformList = [
  { title: '通用', value: 'any' },
  { title: 'macOS', value: 'macos' },
  { title: 'Windows', value: 'windows' },
  { title: 'Linux', value: 'linux' },
  { title: 'Android', value: 'android' },
  { title: 'iOS', value: 'ios' },
]

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
      description: '例如 2.0；多版本时作为切换标签',
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
      url: 'url',
    },
    prepare({ version, platform, url }) {
      const plat =
        platform && platform !== 'any'
          ? platformList.find((p) => p.value === platform)?.title || platform
          : null
      const ver = version ? `v${String(version).replace(/^v/i, '')}` : null
      return {
        title: [plat, ver].filter(Boolean).join(' · ') || '下载项',
        subtitle: url,
      }
    },
  },
})

export default defineType({
  title: '块级富文本',
  name: 'blockContent',
  type: 'array',
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
            type: 'object',
            fields: [
              {
                name: 'color',
                title: '颜色',
                type: 'string',
                options: {
                  list: [
                    { title: '青柠', value: 'lime' },
                    { title: '翠绿', value: 'emerald' },
                    { title: '天蓝', value: 'sky' },
                    { title: '琥珀', value: 'amber' },
                    { title: '玫红', value: 'rose' },
                    { title: '紫色', value: 'violet' },
                    { title: '中灰', value: 'zinc' },
                  ],
                  layout: 'dropdown',
                },
                initialValue: 'lime',
              },
            ],
          },
          {
            title: '高亮底色',
            name: 'highlight',
            type: 'object',
            fields: [
              {
                name: 'color',
                title: '颜色',
                type: 'string',
                options: {
                  list: [
                    { title: '青柠', value: 'lime' },
                    { title: '琥珀', value: 'amber' },
                    { title: '天蓝', value: 'sky' },
                    { title: '玫红', value: 'rose' },
                    { title: '紫色', value: 'violet' },
                  ],
                  layout: 'dropdown',
                },
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
          name: 'note',
          type: 'text',
          rows: 2,
          title: '备注',
          description: '提取码、密码、注意事项等（整组共用）',
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
          description: '支持 YouTube / Bilibili / 直链 mp4 等',
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
