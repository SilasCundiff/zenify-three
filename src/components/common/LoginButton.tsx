'use client'
import { signIn } from 'next-auth/react'

export default function LoginButton() {
  return (
    <button
      className='mb-2 mr-3 w-48 rounded-full bg-sky-800  px-4 py-3 font-semibold text-black'
      onClick={() => signIn('spotify', { callbackUrl: '/' })}
    >
      Login with Spotify
    </button>
  )
}
