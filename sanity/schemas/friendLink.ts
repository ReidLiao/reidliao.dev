import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'friendLink',
  title: '友情链接',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: '站名', type: 'string', validation: (Rule) => Rule.required().max(80) }),
    defineField({ name: 'url', title: '链接', type: 'url', validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'description', title: '简介', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(240) }),
    defineField({ name: 'avatar', title: '头像', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: '排序', type: 'number', initialValue: 100 }),
    defineField({ name: 'approved', title: '审核通过', type: 'boolean', initialValue: false, description: '仅勾选且发布后才会显示在关于页。' }),
  ],
  preview: { select: { title: 'siteName', subtitle: 'url', media: 'avatar' } },
})
