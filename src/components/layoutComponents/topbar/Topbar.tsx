'use client'
import { faEye, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'
import SearchInput from './SearchInput'
import { useUI } from '@/helpers/hooks/useUI'

function Topbar() {
  const { uiHidden, setUiHidden } = useUI()
  return (
    <div className='relative flex w-full p-2 md:grid md:grid-cols-[240px_1fr_240px] md:p-4'>
      <div
        className={`${
          uiHidden ? 'opacity-25' : 'opacity-100'
        } pointer-events-auto absolute top-16 col-start-1 transition-opacity duration-500 hover:opacity-100 md:top-4`}
      >
        <Leva collapsed titleBar={{ title: 'Particle Settings' }} fill />
      </div>
      <div
        className={`${
          uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
        } mr-4 flex w-full transition-opacity duration-500 md:col-start-2 `}
      >
        <SearchInput />
      </div>
      <div className={`ml-2 flex transition-opacity duration-500 md:col-start-3 md:ml-auto`}>
        <button
          className={`${
            uiHidden ? 'opacity-10' : 'opacity-100'
          } rounded-custom pointer-events-auto relative flex min-h-11 w-fit min-w-11 items-center justify-center overflow-hidden text-clip bg-pink-50 p-2 font-semibold text-slate-900 transition-all duration-500 hover:scale-110 hover:opacity-100 md:px-4`}
          onClick={() => {
            setUiHidden(!uiHidden)
          }}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button
          className={`${
            uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
          } rounded-custom ml-2 flex min-h-11 w-fit min-w-11 items-center bg-pink-50 p-2 font-semibold text-slate-900 transition-all duration-500 hover:scale-110 md:px-4 md:py-1`}
          onClick={() => signOut()}
        >
          <span className='hidden md:inline'>Logout</span>
          <FontAwesomeIcon icon={faSignOut} className='m-auto md:my-2 md:ml-2' />
        </button>
      </div>
    </div>
  )
}

export default Topbar
