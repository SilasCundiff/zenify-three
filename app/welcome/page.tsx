/* eslint-disable tailwindcss/no-custom-classname */
import Link from 'next/link'

function Welcome() {
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-extrabold mb-8 text-3xl text-white'>Welcome to Zenify</h1>
        <p className='mb-8 text-lg text-[#18D860] '>
          Zenify (under construction) is a music player for Spotify with a built-in particle audio visualizer. You can
          play your favorite songs from your Spotify playlists.
        </p>
        <p>
          To enable playback, you will need to open an instance of Spotify, play a song there, and then select Zenify as
          your current device. From there, you can freely navigate playlists and control playback from Zenify.
        </p>
        <p>Particle integration coming soon!</p>
      </div>
      <button className='text-md mb-2 px-4 py-3 font-extrabold text-white underline underline-offset-2'>
        <Link href='/login'>Return to login</Link>
      </button>
    </>
  )
}

export default Welcome
