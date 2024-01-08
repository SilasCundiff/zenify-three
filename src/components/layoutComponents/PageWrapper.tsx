'use client'
import { useMouseMovement } from '@/helpers/hooks/useMouseMovement'
import { useUI } from '@/helpers/hooks/useUI'
import { Leva } from 'leva'
import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  const { uiHidden } = useUI()
  const mouseMoved = useMouseMovement()
  // hide particle settings when ui is hidden

  return (
    <div className={`${uiHidden && 'pointer-events-none'} fixed inset-0 z-10 flex h-svh flex-col text-pink-50`}>
      <div
        className={`${
          uiHidden ? (mouseMoved ? 'opacity-25' : 'opacity-25 md:opacity-0') : 'opacity-100'
        } pointer-events-auto absolute top-16 z-0 col-start-1 transition-opacity duration-500 hover:opacity-100 md:top-4 md:z-10`}
      >
        <Leva
          collapsed
          titleBar={{ title: 'Particle Settings' }}
          fill
          theme={{
            colors: {
              accent1: '#FFF',
              accent2: '#F9A8D4',
              accent3: '#FFF',
              elevation1: '#333',
              elevation2: '#111',
              elevation3: '#fff',
            },
          }}
        />
      </div>
      {children}
    </div>
  )
}

export default PageWrapper
