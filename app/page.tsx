// 'use client'

import Bottombar from '@/components/layoutComponents/bottombar/Bottombar'
import Topbar from '@/components/layoutComponents/topbar/Topbar'
import Center from '@/components/layoutComponents/center/Center'

export default function Page() {
  return (
    <>
      <Topbar />
      <Center />
      <Bottombar />
    </>
  )
}
