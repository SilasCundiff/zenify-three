'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

function Welcome() {
  const { status } = useSession()

  return (
    <div className='rounded-custom glass-pane container m-auto flex max-w-fit flex-col items-center justify-center p-8'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-extrabold mb-2 text-3xl font-black tracking-wider text-pink-300 md:text-5xl'>
          What is Zenify?
        </h1>
        <p className='mb-8 text-xl text-pink-50 '>Zenify is an audio visualizer for your Spotify music</p>
        <p className='mb-8 max-w-[80ch] text-center text-base text-pink-50'>
          You can login with you Spotify Premium account and start visualizing your music. <br />
          Search for songs, play music from your playlists, and watch the particles dance!
        </p>
        <p className='mb-8 max-w-[80ch] text-center text-sm text-pink-300'>
          A Spotify premium account is required to use Zenify, due to Spotify&apos;s API restrictions.
        </p>
      </div>
      <div className='flex'>
        {status === 'authenticated' && (
          <button className='text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300'>
            <Link href='/'>Go to Player</Link>
          </button>
        )}
        <button className='text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300'>
          <Link href='/login'>Return to login</Link>
        </button>
        <button
          className={`
           text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300`}
          onClick={() => signOut()}
        >
          <span>Logout</span>
        </button>
      </div>
      <div className='mt-4'>
        <h2 className='text-xl'>Player not loading?</h2>
        <p className='mt-2'>How to start playback:</p>
        <ol className='list-inside list-disc text-sm'>
          <li>Open Spotify on any device, be it your phone, or pc.</li>
          <li>Start playing any song.</li>
          <li>Once the song has started, you can come back here and refresh the page.</li>
          <li>Zenify should now show up as your active device in Spotify and playback should now work.</li>
          <li>
            Note that you can control your currently playing song in both Spotify and Zenify <br />{' '}
            <span className='ml-5'>as long as Zenify remains your active device the visualizer should still work!</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Welcome
