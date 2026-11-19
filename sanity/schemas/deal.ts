import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'deal',
  title: '限时优惠',
  type: 'document',
  fields: [
    defineField({ name: 'provider', title: '服务商', type: 'string', options: { list: [{ title: '阿里云', value: 'aliyun' }, { title: '腾讯云', value: 'tencent' }, { title: 'DMIT', value: 'dmit' }] }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: '优惠名称', type: 'string', validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: 'discount', title: '折扣与价格', type: 'string', description: '按展示文案填写，不自动改写。', validation: (Rule) => Rule.required().max(200) }),
    defineField({ name: 'description', title: '说明', type: 'text', rows: 3 }),
    defineField({ name: 'validUntil', title: '到期日', type: 'date', options: { dateFormat: 'YYYY-MM-DD' } }),
    defineField({ name: 'promotionUrl', title: '推广链接（原样粘贴）', type: 'string', initialValue: 'https://cloud.tencent.com/act/cps/redirect?redirect=2446&cps_key=3fd7338d87b45c8a7518174761d6d58d&from=console', validation: (Rule) => Rule.required().custom((value) => { if (!value) return true; try { return ['http:', 'https:'].includes(new URL(value).protocol) ? true : '仅支持 http/https 链接' } catch { return '请输入完整链接' } }) }),
    defineField({ name: 'order', title: '排序', type: 'number', initialValue: 100 }),
    defineField({ name: 'enabled', title: '显示', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'title', subtitle: 'provider' } },
})
