'use client'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'
import SearchInput from './SearchInput'

function Topbar() {
  return (
    <div className='relative flex w-full p-2 md:grid md:grid-cols-[240px_1fr_240px] md:p-4'>
      <div className=' mr-4 flex w-full  md:col-start-2 '>
        <SearchInput />
      </div>
      <div className='ml-2 md:col-start-3 md:ml-auto'>
        <Leva collapsed hidden />
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
