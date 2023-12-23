'use client'

import Bottombar from '@/components/layoutComponents/bottombar/Bottombar'
import LeftSidebar from '@/components/layoutComponents/leftSidebar/LeftSidebar'
import Topbar from '@/components/layoutComponents/topbar/Topbar'
import Center from '@/components/layoutComponents/center/Center'

export default function Page() {
  return (
    <div className='flex min-h-screen  w-full flex-col justify-between text-white'>
      <div className='flex min-h-[calc(100vh-96px)] basis-full overflow-hidden'>
        <LeftSidebar />
        <div className='min-w-[calc(100%-320px)]'>
          <Topbar />
          <Center />
        </div>
      </div>
      <Bottombar />
    </div>
  )
}
