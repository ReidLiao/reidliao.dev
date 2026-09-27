import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { Layers3Icon } from '~/assets'

export const Project = z.object({
  _id: z.string(),
  name: z.string(),
  url: z.string().url(),
  description: z.string(),
  group: z.enum(['VPS / 服务器', '其他服务']).optional().nullable(),
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
      options: {
        list: [
          { title: 'VPS / 服务器', value: 'VPS / 服务器' },
          { title: '其他服务', value: '其他服务' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
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
