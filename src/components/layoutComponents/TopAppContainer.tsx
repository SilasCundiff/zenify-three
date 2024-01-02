'use client'
import { useUI } from '@/helpers/hooks/useUI'
import Topbar from './topbar/Topbar'
import Center from './center/Center'

export default function TopAppContainer() {
  const { uiHidden } = useUI()
  return (
    <div
      className={`${
        uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      } flex-1 transition-opacity duration-500 `}
    >
      <Topbar />
      <Center />
    </div>
  )
}
