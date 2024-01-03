'use client'
import Topbar from './topbar/Topbar'
import Center from './center/Center'

export default function TopAppContainer() {
  return (
    <div className={`flex flex-1 flex-col`}>
      <Topbar />
      <Center />
    </div>
  )
}
