import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { Layers3Icon } from '~/assets'

export const Project = z.object({
  _id: z.string(),
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  group: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  icon: z.object({
    _ref: z.string(),
    asset: z.any(),
  }),
})
export type Project = z.infer<typeof Project>

export default defineType({
  name: 'project',
  title: '机房',
  type: 'document',
  icon: Layers3Icon,
  fields: [
    defineField({
      name: 'name',
      title: '名字',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: '链接',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
    }),
    defineField({
      name: 'group',
      title: '分组',
      type: 'string',
      description: '手填分组名称；留空时前台归入“其他服务”。',
    }),
    defineField({
      name: 'badge',
      title: '徽章',
      type: 'string',
      description: '手填前台显示的徽章文字，例如：本站在用、推荐、优惠、新入驻。',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'icon',
      title: '图片',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
