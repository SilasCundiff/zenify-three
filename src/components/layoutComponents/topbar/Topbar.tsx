'use client'
import { signOut } from 'next-auth/react'

function Topbar() {
  return (
    <div className='flex h-16  min-w-full items-center justify-end'>
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
