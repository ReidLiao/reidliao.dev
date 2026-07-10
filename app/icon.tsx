import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: '#f0f6fc',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            letterSpacing: -0.5,
            lineHeight: 1,
          }}
        >
          {'>_'}
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
