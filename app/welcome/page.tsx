/* eslint-disable tailwindcss/no-custom-classname */
import Link from 'next/link'

function Welcome() {
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-extrabold mb-8 text-3xl text-white'>Welcome to Zenify</h1>
        <p className='mb-8 text-lg text-[#18D860] '>A work-in-progress audio visualizer for your Spotify music.</p>
        <p className='mb-8 max-w-[80ch] text-center text-sm text-white'>
          This is the most basic functioning version, allowing song playback and playlist navigation, as well as debug
          tools for the particles. To begin, please login with Spotify, and make sure you have an active device, either
          on your desktop or phone.
        </p>
      </div>
      <div className='flex'>
        <button className='text-md mb-2 px-4 py-3 font-extrabold text-white underline underline-offset-2'>
          <Link href='/'>Player Home</Link>
        </button>
        <button className='text-md mb-2 px-4 py-3 font-extrabold text-white underline underline-offset-2'>
          <Link href='/login'>Return to login</Link>
        </button>
      </div>
    </>
  )
}

export default Welcome
