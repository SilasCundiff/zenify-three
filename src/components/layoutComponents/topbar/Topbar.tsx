'use client'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'

function Topbar() {
  return (
    <div className=' relative grid min-h-16'>
      {/* <div className='placeholder m-o col-start-1 bg-red-500 p-0'></div> */}
      <div className='col-start-2 flex px-4'>
        <input
          className='rounded-custom mx-auto mb-2 mt-4 w-full max-w-80 bg-slate-50 px-4 py-2 font-semibold text-black'
          type='text'
          name='search'
          id='search'
          placeholder='Search for a song'
        />
      </div>
      <div className='col-start-3 ml-auto'>
        <Leva collapsed hidden />
        <button
          className='rounded-custom mx-4 mb-2 mt-4 w-fit bg-slate-50  px-4 py-2 font-semibold text-black'
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
