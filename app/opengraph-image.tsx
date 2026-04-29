import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VIBECODEI'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#2a2a2a',
        color: '#f5f5f5',
        display: 'flex',
        fontSize: 110,
        fontWeight: 700,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: 4,
        textTransform: 'uppercase',
        width: '100%',
      }}
    >
      VIBECODEI
    </div>,
    {
      ...size,
    },
  )
}
