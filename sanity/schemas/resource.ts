import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'resource',
  title: '资源',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '名称',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'url',
      title: '夸克链接',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'name' } },
})
