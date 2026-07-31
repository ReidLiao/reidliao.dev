import { defineField, defineType } from 'sanity'
import { z } from 'zod'

import { PencilSwooshIcon } from '~/assets'
import { readingTimeType } from '~/sanity/schemas/types/readingTime'

export const Post = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  mainImage: z.object({
    _ref: z.string(),
    asset: z.object({
      url: z.string(),
      lqip: z.string().optional(),
      dominant: z
        .object({
          background: z.string(),
          foreground: z.string(),
        })
        .optional(),
    }),
  }),
  publishedAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  description: z.string(),
  categories: z.array(z.string()).optional(),
  body: z.any(),
  readingTime: z.number(),
  mood: z.enum(['happy', 'sad', 'neutral']),
})
export type Post = z.infer<typeof Post>
export type PostDetail = Post & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headings: any[]
  related?: Post[]
}

export default defineType({
  name: 'post',
  title: '文章',
  type: 'document',
  icon: PencilSwooshIcon,
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '链接标识符',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: '分类',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: '更新时间',
      type: 'datetime',
      description:
        '文章有实质更新时再填写。前台会显示「更新于」；sitemap / JSON-LD 也会用此时间。留空则等同发布时间。',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!value) return true
          const publishedAt = (context.document as { publishedAt?: string } | undefined)
            ?.publishedAt
          if (!publishedAt) return true
          if (new Date(value).getTime() < new Date(publishedAt).getTime()) {
            return '更新时间不能早于发布时间'
          }
          return true
        }),
    }),
    defineField({
      name: 'mainImage',
      title: '主图',
      type: 'image',
      description: 'This image will be used for the preview (1200 x 675px)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'readingTime',
      title: '阅读时长（分钟）',
      type: readingTimeType.name,
      validation: (Rule) => Rule.required(),
      options: {
        source: 'body',
      },
    }),
    defineField({
      name: 'mood',
      title: '文章情绪',
      type: 'string',
      options: {
        list: [
          { title: 'Neutral', value: 'neutral' },
          { title: 'Happy', value: 'happy' },
          { title: 'Sad', value: 'sad' },
        ],
        layout: 'radio',
      },
    }),
  ],

  initialValue: () => ({
    publishedAt: new Date().toISOString(),
    mood: 'neutral',
    readingTime: 0,
  }),

  preview: {
    select: {
      title: 'title',
      author: 'slug',
      media: 'mainImage',
    },
  },
})
