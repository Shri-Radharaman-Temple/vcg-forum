import type { Metadata } from 'next'
import { Mukta, Tiro_Devanagari_Hindi } from 'next/font/google'
import { SessionProvider } from '@/components/app/session'
import './globals.css'

/**
 * Mukta at 200–500 carries the whole interface; Tiro Devanagari Hindi is used
 * only for section titles and greetings, per the design's type note.
 */
const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-mukta',
  display: 'swap',
})

const tiro = Tiro_Devanagari_Hindi({
  subsets: ['devanagari', 'latin'],
  weight: ['400'],
  variable: '--font-tiro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VCG · श्री राधारमण परिवार',
  description:
    'A private community for the Radharaman Parivar — sadhna, feed, chat, resources and events.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mukta.variable} ${tiro.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
