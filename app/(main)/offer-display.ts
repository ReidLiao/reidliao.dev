export const offerCategories = ['限时', '免费', '新用户'] as const

const pricePattern =
  /(?:首年(?:低至|仅需|仅售|价)?|低至|仅需|仅售|到手价)?\s*(?:[¥￥]\s*\d+(?:\.\d{1,2})?万?元?|\d+(?:\.\d{1,2})?万?\s*元)(?:\s*(?:[/／]\s*[年月天次]|起))?/g

function readPrice(title: string) {
  for (const match of title.matchAll(pricePattern)) {
    const before = title.slice(0, match.index).trimEnd()
    const after = title.slice(match.index + match[0].length).trimStart()
    // 面值、满减门槛和原价不能当成实际支付价。
    if (/(?:满|减|返|送|原价|价值|补贴|优惠券)[：:]?$/.test(before)) continue
    if (/^(?:券|红包|优惠券|抵扣|补贴|立减)/.test(after)) continue
    return match[0].trim()
  }
  return null
}

function readDeadline(title: string) {
  // 只采用带年份且明确标为截止时间的日期。仅写日期时按当天结束计算。
  const match = title.match(
    /(?:截止(?:日期|时间)?|截至|到期|结束)(?:于|至|[：:]\s*)?\s*(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})(?:日)?(?:[ T\s]+(\d{1,2})[：:](\d{2})(?:[：:](\d{2}))?)?/
  )
  if (!match) return null

  const [, year, month, day, hour, minute, second] = match
  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  const utcDate = new Date(`${date}T00:00:00Z`)
  if (
    Number.isNaN(utcDate.valueOf()) ||
    utcDate.toISOString().slice(0, 10) !== date ||
    Number(hour ?? 0) > 23
  ) {
    return null
  }

  const time = hour
    ? `${hour.padStart(2, '0')}:${minute}:${second ?? '00'}`
    : '23:59:59'
  const deadline = Date.parse(`${date}T${time}+08:00`)
  return Number.isNaN(deadline) ? null : deadline
}

export function describeOffer(title: string, tags: string[] = []) {
  const categories = new Set(tags.map((tag) => tag.trim()).filter(Boolean))
  if (categories.delete('新用户专享')) categories.add('新用户')

  const deadline = readDeadline(title)
  const explicitlyFree =
    /(?:^|[\s，、；：！。（(])(?:全程免费|完全免费|免费(?:试用|领取|使用|体验|开放|下载|申请)|免费(?=$|[\s，、；：！。)）]))/.test(
      title
    )
  if (deadline !== null || /(?:^|[\s，、；：！。（(])限时/.test(title)) {
    categories.add('限时')
  }
  if (explicitlyFree) categories.add('免费')
  if (
    /(?:^|[\s，、；：！。（(])新用户(?:专享|专属|限定|注册送|送|优惠)/.test(
      title
    )
  ) {
    categories.add('新用户')
  }

  const price = readPrice(title)
  return {
    categories,
    deadline,
    price: price ?? (explicitlyFree || categories.has('免费') ? '免费' : null),
  }
}

export function formatOfferCountdown(deadline: number, now: number) {
  if (deadline <= now) return '已结束'

  const daysLeft = Math.ceil((deadline - now) / 86400000)
  if (daysLeft <= 30) return `剩 ${daysLeft} 天`

  const date = new Date(deadline + 8 * 60 * 60 * 1000)
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${month}-${day} 截止`
}

export function parseOfferDeadline(date?: string | null) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null

  const utcDate = new Date(`${date}T00:00:00Z`)
  if (
    Number.isNaN(utcDate.valueOf()) ||
    utcDate.toISOString().slice(0, 10) !== date
  ) {
    return null
  }

  return Date.parse(`${date}T23:59:59+08:00`)
}
