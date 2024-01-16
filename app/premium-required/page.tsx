'use client'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

function Welcome() {
  useEffect(() => {
    window.history.pushState({}, '', '/premium-required')
  }, [])

  return (
    <div className='rounded-custom glass-pane container m-auto flex max-w-fit flex-col items-center justify-center p-8'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-extrabold mb-2 text-3xl font-black tracking-wider text-pink-300 md:text-5xl'>
          Hey there 👋!
        </h1>
        <p className='mb-8 text-xl text-pink-50 '>Thanks for checking out Zenify!</p>
        <p>
          Unfortunately due to the limitations set in place by Spotify&apos;s api, this app requires a Spotify Premium
          subscription to work.
        </p>
        <p>
          I apologize for the inconvenience! If you would still like to see the Visualizer in action, here is a small
          demo video.
        </p>
        <iframe
          className='rounded-custom mt-8'
          width='560'
          height='315'
          src='https://www.youtube.com/embed/LaHBh5crxMk?si=uZUxpp21cEJuXrkv'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        ></iframe>
        <div className='mt-4 flex'>
          <button className='text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300'>
            <Link href='/info'>Learn About Zenify</Link>
          </button>
          <button
            className={`
           text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300`}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
