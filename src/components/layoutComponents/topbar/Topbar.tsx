'use client'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'
import SearchInput from './SearchInput'
import { useUI } from '@/helpers/hooks/useUI'

function Topbar() {
  const { uiHidden } = useUI()
  return (
    <div className='relative flex w-full p-2 md:grid md:grid-cols-[240px_1fr_240px] md:p-4'>
      <div
        className={`${
          uiHidden ? 'opacity-25' : 'opacity-100'
        } absolute top-4 col-start-1 transition-opacity duration-500 hover:opacity-100`}
      >
        <Leva titleBar={{ title: 'Particle Settings' }} fill />
      </div>
      <div
        className={`${
          uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        } mr-4 flex w-full transition-opacity duration-500  md:col-start-2 `}
      >
        <SearchInput />
      </div>
      <div
        className={`${
          uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        } ml-2 transition-opacity duration-500 md:col-start-3 md:ml-auto`}
      >
        <button
          className='rounded-custom flex min-h-10 w-fit min-w-10 items-center bg-slate-50 p-2 font-semibold text-black md:px-4'
          onClick={() => signOut()}
        >
          <span className='hidden md:inline'>Logout</span>
          <FontAwesomeIcon icon={faSignOut} className=' m-auto md:ml-2 md:mt-1' />
        </button>
      </div>
    </div>
  )
}

export default Topbar
