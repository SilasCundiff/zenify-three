import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  return <div className='fixed inset-0 flex h-svh flex-col text-white'>{children}</div>
}

export default PageWrapper
