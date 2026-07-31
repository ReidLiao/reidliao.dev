/**
 * 分类 → 强调色。用于封面（生成/上传）与分享图，让不同分类有稳定、克制的色彩层次。
 * 常见分类走显式映射，其余按名称哈希稳定取色；无分类回落到站点主色 lime。
 */
export type CategoryAccent = {
  /** 光晕用的 RGB 三元组，配合不同透明度使用 */
  rgb: string
  /** 圆点 / 短杠等实心元素 */
  dot: string
  /** 分类文字（偏亮的 300 档，暗底可读） */
  text: string
}

const PALETTE: CategoryAccent[] = [
  { rgb: '163,230,53', dot: '#a3e635', text: '#bef264' }, // lime
  { rgb: '56,189,248', dot: '#38bdf8', text: '#7dd3fc' }, // sky
  { rgb: '251,191,36', dot: '#fbbf24', text: '#fcd34d' }, // amber
  { rgb: '167,139,250', dot: '#a78bfa', text: '#c4b5fd' }, // violet
  { rgb: '52,211,153', dot: '#34d399', text: '#6ee7b7' }, // emerald
  { rgb: '251,113,133', dot: '#fb7185', text: '#fda4af' }, // rose
  { rgb: '34,211,238', dot: '#22d3ee', text: '#67e8f9' }, // cyan
]

const OVERRIDES: Record<string, number> = {
  随笔: 0,
  软件: 1,
  下载: 1,
  运维: 2,
  系统运维: 2,
  全栈: 3,
  建站: 3,
  全栈建站: 3,
  折腾: 5,
  云端架构: 6,
  云服务: 6,
  机房: 6,
}

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export function getCategoryAccent(category?: string): CategoryAccent {
  if (!category) return PALETTE[0]
  const idx =
    category in OVERRIDES ? OVERRIDES[category] : hash(category) % PALETTE.length
  return PALETTE[idx]
}
