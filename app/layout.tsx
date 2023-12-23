import { Metadata } from 'next'
import { Noto_Sans_Display } from 'next/font/google'
import { getServerSession } from 'next-auth'

import PageWrapper from '@/components/dom/PageWrapper'
import ParticleCanvas from '@/components/canvas/ParticleCanvas'
import { authOptions } from '@/helpers/authOptions'

import './global.css'
import Provider from '@/components/context/client-provider'

const natoSansDisplay = Noto_Sans_Display({
  subsets: ['latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Zenify',
  description: 'Zenify is a music player for Spotify with a built-in particle audio visualizer.',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang='en' className={`${natoSansDisplay.className} antialiased`}>
      <head />
      <body>
        <Provider session={session}>
          <PageWrapper>{children}</PageWrapper>
          <ParticleCanvas />
        </Provider>
      </body>
    </html>
  )
}
