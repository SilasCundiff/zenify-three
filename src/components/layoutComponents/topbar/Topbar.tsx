'use client'
import { Leva } from 'leva'
import { signOut } from 'next-auth/react'

function Topbar() {
  return (
    <div className='relative flex  h-16 min-w-full items-center justify-end'>
      <div className='absolute right-32 top-3'>
        <Leva collapsed fill />
      </div>
      <button
        className='m-2 w-24 rounded-full bg-[#18D860] px-3  py-2 font-semibold text-black'
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  )
}

export default Topbar
