// 'use client'

import Bottombar from '@/components/layoutComponents/bottombar/Bottombar'
import Topbar from '@/components/layoutComponents/topbar/Topbar'
import Center from '@/components/layoutComponents/center/Center'

export default function Page() {
  return (
    <div className='page-wrapper flex flex-col text-white'>
      <Topbar />
      <Center />
      <Bottombar />
    </div>
  )
}
