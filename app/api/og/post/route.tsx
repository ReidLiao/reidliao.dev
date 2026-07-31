import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

import { getCategoryAccent } from '~/lib/category-accent'
import { client } from '~/sanity/lib/client'

export const runtime = 'nodejs'
export const revalidate = 86400

const WIDTH = 1200
const HEIGHT = 630

// 进程内缓存字体子集：同一进程重复渲染同一批字符时免去再次拉取。
const fontSubsetCache = new Map<string, ArrayBuffer>()

// 按需向 Google Fonts 请求「只含本图用到的字符」的字体子集，避免打包多 MB 中文字体。
async function loadFontSubset(family: string, text: string, weight: number) {
  const cacheKey = `${family}:${weight}:${text}`
  const cached = fontSubsetCache.get(cacheKey)
  if (cached) return cached

  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`

  const css = await (
    await fetch(url, {
      // 不带浏览器 UA 时 Google 返回 ttf，satori 可直接使用。
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
  ).text()

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/
  )
  if (!resource) throw new Error('font subset not found')

  const res = await fetch(resource[1])
  if (!res.ok) throw new Error('font download failed')
  const data = await res.arrayBuffer()
  fontSubsetCache.set(cacheKey, data)
  return data
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')?.trim()

  let title = 'reidliao.dev'
  let category = ''

  if (slug) {
    try {
      const data = await client.fetch<{
        title?: string
        category?: string
      } | null>(
        `*[_type == "post" && slug.current == $slug][0]{ title, "category": categories[0]->title }`,
        { slug },
        { next: { revalidate: 600 } }
      )
      if (data?.title) title = data.title
      if (data?.category) category = data.category
    } catch {
      // 取不到就用兜底文案。
    }
  }

  const brand = 'reidliao.dev'
  const kicker = (category || brand).toUpperCase()
  const subsetText = `${title}${kicker}${brand}`
  const avatarUrl = `${req.nextUrl.origin}/avatar.jpg`
  const accent = getCategoryAccent(category || undefined)
  const firstGlyph = Array.from(title.trim())[0] ?? '·'
  const titleLen = Array.from(title.trim()).length
  const titleSize =
    titleLen > 40 ? 48 : titleLen > 26 ? 60 : titleLen > 18 ? 72 : 82

  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700 }[] = []
  try {
    const [bold, regular] = await Promise.all([
      loadFontSubset('Noto Sans SC', subsetText, 700),
      loadFontSubset('Noto Sans SC', subsetText, 400),
    ])
    fonts = [
      { name: 'Noto Sans SC', data: bold, weight: 700 },
      { name: 'Noto Sans SC', data: regular, weight: 400 },
    ]
  } catch {
    fonts = []
  }

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0a0a0f',
          backgroundImage: `radial-gradient(circle at 82% 18%, rgba(${accent.rgb},0.24), transparent 46%), linear-gradient(115deg, rgba(255,255,255,0.03), transparent 40%), linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.92) 100%), radial-gradient(rgba(255,255,255,0.06) 1.4px, transparent 1.6px)`,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 30px 30px',
          color: '#ffffff',
          fontFamily: 'Noto Sans SC',
        }}
      >
        {/* 左侧分类色条 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: 14,
            backgroundColor: accent.dot,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          width={72}
          height={72}
          alt=""
          style={{
            position: 'absolute',
            left: 64,
            top: 56,
            width: '72px',
            height: '72px',
            borderRadius: '9999px',
            border: '2px solid rgba(255,255,255,0.25)',
          }}
        />

        {/* 超大淡色首字 */}
        <div
          style={{
            position: 'absolute',
            right: 48,
            bottom: -70,
            fontSize: 440,
            fontWeight: 700,
            lineHeight: 1,
            color: accent.dot,
            opacity: 0.12,
          }}
        >
          {firstGlyph}
        </div>

        {/* 内容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            paddingLeft: 84,
            paddingRight: 72,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '9999px',
                backgroundColor: accent.dot,
              }}
            />
            <div
              style={{
                fontSize: '28px',
                letterSpacing: '0.16em',
                color: accent.text,
                fontWeight: 400,
              }}
            >
              {kicker}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: '28px',
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: '860px',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              marginTop: '34px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: accent.dot,
              }}
            />
            <div style={{ fontSize: '30px', color: 'rgba(255,255,255,0.5)' }}>
              {brand}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: fonts.length
        ? fonts.map((f) => ({
            name: f.name,
            data: f.data,
            weight: f.weight,
            style: 'normal' as const,
          }))
        : undefined,
      headers: {
        'Cache-Control':
          'public, immutable, no-transform, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
