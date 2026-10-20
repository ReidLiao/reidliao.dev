import { defineField, defineType } from 'sanity'

import { FilterHorizontalIcon } from '~/assets'

export default defineType({
  name: 'settings',
  title: '网站设置',
  type: 'document',
  icon: FilterHorizontalIcon,
  fields: [
    defineField({
      name: 'announcement',
      title: '首访公告',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'enabled', title: '启用公告', type: 'boolean', initialValue: false }),
        defineField({ name: 'version', title: '版本号', type: 'string', description: '修改公告并希望访客再次看到时递增，例如 1 → 2。', validation: (Rule) => Rule.required() }),
        defineField({ name: 'title', title: '标题', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'body', title: '正文', type: 'text', rows: 4 }),
        defineField({ name: 'image', title: '配图', type: 'image', description: '建议 16:9，可用热点调整主体位置。', options: { hotspot: true } }),
        defineField({ name: 'buttonText', title: '按钮文字', type: 'string' }),
        defineField({
          name: 'buttonLink',
          title: '按钮链接',
          type: 'string',
          description: '可填站内路径（如 /blog）或 http/https 完整网址。',
          validation: (Rule) => Rule.custom((value) =>
            !value || (value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\//i.test(value)
              ? true
              : '请填写站内路径或 http/https 链接'
          ),
        }),
      ],
    }),
    defineField({
      name: 'projects',
      title: '机房推荐列表',
      description: '在 `/vps`（机房）页面展示的服务商 / 联盟链接列表',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'project' } }],
    }),

    defineField({
      name: 'heroPhotos',
      title: '首页图片',
      description: '首页顶部的几张图片（推荐设置 6 张）',
      type: 'array',
      of: [{ type: 'image' }],
    }),

    defineField({
      name: 'resume',
      title: '简历',
      description: '在主页侧边栏展示的简历信息（留空就不展示）',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'company',
              title: '公司名称',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: '职位',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: '公司 Logo',
              description: '建议尺寸 100x100px 正方形裁切',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'start',
              title: '开始时间',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'end',
              title: '结束时间（留空会显示“至今”）',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              company: 'company',
              title: 'title',
              logo: 'logo',
              start: 'start',
              end: 'end',
            },
            prepare: (selection) => ({
              title: `${selection.company} - ${selection.title}`,
              subtitle: `${selection.start} - ${selection.end ?? '至今'}`,
              media: selection.logo,
            }),
          },
        },
      ],
    }),
  ],

  preview: {
    select: {},
    prepare: () => ({
      title: '网站设置',
    }),
  },
})
