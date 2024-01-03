'use client'
import { useUI } from '@/helpers/hooks/useUI'
import Topbar from './topbar/Topbar'
import Center from './center/Center'

export default function TopAppContainer() {
  const { uiHidden } = useUI()
  return (
    <div className={` flex-1 grow-0 md:grow`}>
      <Topbar />
      <Center />
    </div>
  )
}
