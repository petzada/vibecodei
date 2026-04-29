import type { Metadata, Viewport } from 'next'
import { Jersey_25, Roboto } from 'next/font/google'
import './globals.css'

const jersey = Jersey_25({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vibecodei.com.br'),
  title: {
    default: 'VIBECODEI',
    template: '%s · VIBECODEI',
  },
  description: 'Conteúdo curto e direto sobre programação.',
  openGraph: {
    title: 'VIBECODEI',
    description: 'Conteúdo curto e direto sobre programação.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport: Viewport = {
  themeColor: '#2a2a2a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jersey.variable} ${roboto.variable}`}>
      <body className="bg-page text-ink-200">{children}</body>
    </html>
  )
}
