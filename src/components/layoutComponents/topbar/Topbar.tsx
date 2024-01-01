'use client'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'

function Topbar() {
  return (
    <div className='relative flex w-full p-2 md:grid md:grid-cols-[240px_1fr_240px] md:p-4'>
      <div className=' mr-4 flex w-full  md:col-start-2'>
        <input
          className='rounded-custom w-full bg-slate-50 px-4 py-2 font-semibold text-black md:mx-auto md:max-w-80'
          type='text'
          name='search'
          id='search'
          placeholder='Search for a song'
        />
      </div>
      <div className='ml-2 md:col-start-3 md:ml-auto'>
        <Leva collapsed hidden />
        <button
          className='rounded-custom w-fit bg-slate-50  px-4 py-2 font-semibold text-black'
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
