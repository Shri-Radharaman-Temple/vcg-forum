import type { MetadataRoute } from 'next'

/** Lets devotees add VCG to their home screen and open it like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VCG · श्री राधारमण परिवार',
    short_name: 'VCG',
    description:
      'A private community for the Radharaman Parivar — sadhna, feed, chat, resources and events.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4eee5',
    theme_color: '#f1eadf',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
