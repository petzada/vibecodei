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
    template: '%s - VIBECODEI',
  },
  description: 'Conteudo curto e direto sobre programacao.',
  openGraph: {
    title: 'VIBECODEI',
    description: 'Conteudo curto e direto sobre programacao.',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'VIBECODEI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIBECODEI',
    description: 'Conteudo curto e direto sobre programacao.',
    images: ['/opengraph-image'],
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
