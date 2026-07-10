import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          padding: 36,
        }}
      >
        <span
          style={{
            color: '#f0f6fc',
            fontSize: 56,
            fontWeight: 700,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            letterSpacing: -1,
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
