import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

import { client } from '~/sanity/lib/client'

export const runtime = 'nodejs'
export const revalidate = 86400

const WIDTH = 1200
const HEIGHT = 630

// 按需向 Google Fonts 请求「只含本图用到的字符」的字体子集，避免打包多 MB 中文字体。
async function loadFontSubset(family: string, text: string, weight: number) {
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
  return res.arrayBuffer()
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#0a0a0f',
          backgroundImage:
            'radial-gradient(900px circle at 8% -12%, rgba(163,230,53,0.20), transparent 55%), radial-gradient(700px circle at 108% 118%, rgba(163,230,53,0.10), transparent 60%), linear-gradient(to bottom, transparent 45%, rgba(10,10,15,0.9) 100%), linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 44px 44px, 44px 44px',
          color: '#ffffff',
          fontFamily: 'Noto Sans SC',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            width={64}
            height={64}
            alt=""
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '9999px',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '9999px',
                backgroundColor: '#a3e635',
              }}
            />
            <div
              style={{
                fontSize: '26px',
                letterSpacing: '0.14em',
                color: '#bef264',
                fontWeight: 400,
              }}
            >
              {kicker}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 22 ? '64px' : '76px',
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              marginTop: '36px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: '#a3e635',
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
    }
  )
}
