'use client'
import { signIn } from 'next-auth/react'

export default function LoginButton() {
  return (
    <button
      className='rounded-custom mb-2 mr-3 bg-pink-300 px-4 py-2 font-semibold text-black transition-colors duration-300 ease-in-out hover:bg-pink-100'
      onClick={() => signIn('spotify', { callbackUrl: '/' })}
    >
      Login with Spotify
    </button>
  )
}
