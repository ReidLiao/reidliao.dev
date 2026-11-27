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
      of: [
        {
          type: 'image',
          fields: [
            defineField({
              name: 'link',
              title: '跳转链接',
              type: 'url',
              description: '可选，填写目标文章的绝对 URL；留空则只显示图片。',
            }),
            defineField({
              name: 'description',
              title: '图片描述',
              type: 'string',
              description: '用于首页图片的替代文本和链接可访问名称，简短说明图片内容。',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'limitedOffers',
      title: '首页优惠活动',
      description: '按这里的顺序展示。已有活动可以继续使用原商家资料，也可以改选供应商。',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'supplier',
              title: '供应商',
              type: 'reference',
              to: [{ type: 'offerSupplier' }],
              description: '选择已发布的供应商。头像在「优惠活动供应商」里统一维护。',
              validation: (Rule) =>
                Rule.custom((value, { parent }) =>
                  value || (parent as { company?: string } | undefined)?.company
                    ? true
                    : '请选择供应商'
                ),
            }),
            defineField({
              name: 'company',
              title: '原商家名称',
              type: 'string',
              hidden: ({ parent, value }) => Boolean(parent?.supplier || !value),
            }),
            defineField({
              name: 'title',
              title: '活动说明',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: '副标题描述',
              type: 'string',
              description: '活动标题下方的补充说明，可选。',
              validation: (Rule) => Rule.max(120),
            }),
            defineField({
              name: 'deadline',
              title: '截止日期',
              type: 'date',
              description: '可选；填写后显示截止日期或剩余天数，留空时显示“长期活动”。',
            }),
            defineField({
              name: 'logo',
              title: '原商家头像',
              description: '建议尺寸 100x100px 正方形裁切',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({ parent, value }) => Boolean(parent?.supplier || !value),
            }),
            defineField({
              name: 'tags',
              title: '筛选标签',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' },
              description: '可填多个标签，例如限时、免费、新用户。首页会从所有已发布活动汇总标签。',
              validation: (Rule) => Rule.unique(),
            }),
            defineField({
              name: 'url',
              title: '跳转链接',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: {
              company: 'company',
              supplier: 'supplier.name',
              title: 'title',
              logo: 'logo',
              avatar: 'supplier.avatar',
              url: 'url',
            },
            prepare: (selection) => ({
              title: selection.title,
              subtitle: selection.supplier ?? selection.company ?? selection.url,
              media: selection.avatar ?? selection.logo,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'offersAllLink',
      title: '优惠活动 · 查看全部链接',
      type: 'url',
      description: '留空时跳转到 /vps；也可填写其他站内路径或完整网址。',
      initialValue: '/vps',
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'offersAvatarNote',
      title: '优惠活动 · 头像旁说明',
      type: 'string',
      description: '显示在活动头像旁，可填写产品口径的数量说明。留空时前台按活动涉及的常用服务数生成默认文案。',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'offersDescription',
      title: '优惠活动 · 头部说明',
      type: 'string',
      description: '显示在首页“最新优惠”标题下方。',
      initialValue: '我自己在用的几家，活动价比日常价划算不少。',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'latestSoftware',
      title: '首页最新软件',
      type: 'array',
      description: '每项显示一行，按这里的顺序展示。文章发布后可把链接换成文章地址。',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: '软件名称',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: '软件图标',
              type: 'image',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: '链接',
              type: 'url',
              description: '可填官网完整网址，或已发布文章的链接，如 /blog/xxx。',
              validation: (Rule) =>
                Rule.required().uri({ allowRelative: true, scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'url', media: 'icon' } },
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
