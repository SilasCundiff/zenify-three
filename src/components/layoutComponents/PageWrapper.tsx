'use client'
import { useUI } from '@/helpers/hooks/useUI'
import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  const { uiHidden } = useUI()
  return (
    <div className={`${uiHidden && 'pointer-events-none'} fixed inset-0 z-10 flex h-svh flex-col text-pink-50`}>
      {children}
    </div>
  )
}

export default PageWrapper
