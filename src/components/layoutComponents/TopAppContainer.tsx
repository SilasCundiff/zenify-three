'use client'
import { useUI } from '@/helpers/hooks/useUI'
import Topbar from './topbar/Topbar'
import Center from './center/Center'

export default function TopAppContainer() {
  const { uiHidden } = useUI()
  return (
    <div className={`flex flex-1 flex-col`}>
      <Topbar />
      <Center />
    </div>
  )
}
