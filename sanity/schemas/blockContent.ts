import { defineArrayMember, defineType } from 'sanity'

import { Tweet } from '~/sanity/components/Tweet'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export default defineType({
  title: '块级富文本',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
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
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: '加粗', value: 'strong' },
          { title: '斜体', value: 'em' },
          { title: '下划线', value: 'underline' },
          { title: '删除线', value: 'strike-through' },
          { title: '代码', value: 'code' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
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
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
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
          name: 'url',
          type: 'url',
          title: '下载链接',
          description: '网盘或外链，勿托管到本站服务器',
          validation: (Rule) =>
            Rule.required().uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'version',
          type: 'string',
          title: '版本',
          description: '例如 1.2.0',
        },
        {
          name: 'platform',
          type: 'string',
          title: '平台',
          options: {
            list: [
              { title: '通用', value: 'any' },
              { title: 'macOS', value: 'macos' },
              { title: 'Windows', value: 'windows' },
              { title: 'Linux', value: 'linux' },
              { title: 'Android', value: 'android' },
              { title: 'iOS', value: 'ios' },
            ],
            layout: 'radio',
          },
          initialValue: 'any',
        },
        {
          name: 'size',
          type: 'string',
          title: '大小',
          description: '例如 128 MB',
        },
        {
          name: 'checksum',
          type: 'string',
          title: '校验和',
          description: '可选，如 SHA256',
        },
        {
          name: 'note',
          type: 'text',
          rows: 3,
          title: '备注',
          description: '提取码、密码、注意事项等',
        },
      ],
      preview: {
        select: {
          title: 'title',
          version: 'version',
          platform: 'platform',
        },
        prepare({ title, version, platform }) {
          const bits = [version, platform !== 'any' ? platform : null].filter(
            Boolean
          )
          return {
            title: title || '下载块',
            subtitle: bits.length ? bits.join(' · ') : '未填写版本',
          }
        },
      },
    }),
  ],
})
