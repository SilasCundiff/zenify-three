import { FunctionComponent } from 'react'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper: FunctionComponent<PageWrapperProps> = ({ children }) => {
  return <div className='page-wrapper flex flex-col text-white'>{children}</div>
}

export default PageWrapper
