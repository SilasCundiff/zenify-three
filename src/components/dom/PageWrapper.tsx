import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  return (
    <div className='flex max-h-screen min-h-screen w-full  flex-col items-center justify-center bg-gradient-to-b from-black to-zinc-900'>
      {children}
    </div>
  )
}

export default PageWrapper
