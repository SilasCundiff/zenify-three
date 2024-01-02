import { Metadata } from 'next'
import { Noto_Sans_Display, Zen_Kaku_Gothic_New } from 'next/font/google'
import { getServerSession } from 'next-auth'
import ParticleCanvas from '@/components/canvas/ParticleCanvas'
import { authOptions } from '@/helpers/authOptions'

import './global.css'
import Provider from '@/components/context/client-provider'
import Page from './page'
import PageWrapper from '@/components/layoutComponents/PageWrapper'

const natoSansDisplay = Noto_Sans_Display({
  subsets: ['latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Zenify',
  description: 'Zenify is a music player for Spotify with a built-in particle audio visualizer.',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang='en' className={`${zenKakuGothicNew.className} antialiased`}>
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
