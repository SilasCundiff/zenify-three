import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  return <div className='flex max-h-screen min-h-screen w-full  flex-col items-center justify-center'>{children}</div>
}

export default PageWrapper
