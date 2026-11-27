import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'offerSupplier',
  title: '优惠活动供应商',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '名称',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: '头像',
      type: 'image',
      description: '建议上传正方形图片。同一供应商的活动共用这张头像。',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'name', media: 'avatar' } },
})
