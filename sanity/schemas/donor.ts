import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'donor',
  title: '感谢名单',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '名字',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: '日期',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: '留言',
      type: 'text',
      rows: 3,
    }),
  ],
})
