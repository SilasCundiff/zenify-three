'use client'

import Bottombar from '@/components/layoutComponents/bottombar/Bottombar'
import LeftSidebar from '@/components/layoutComponents/leftSidebar/LeftSidebar'
import Topbar from '@/components/layoutComponents/topbar/Topbar'
import Center from '@/components/layoutComponents/center/Center'

export default function Page() {
  return (
    <div className='flex flex-col justify-between text-white'>
      <div className='flex basis-full overflow-hidden'>
        {/* <LeftSidebar /> */}
        <div className='w-full'>
          <Topbar />
          <Center />
        </div>
      </div>
      <Bottombar />
    </div>
  )
}
