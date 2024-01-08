import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/helpers/authOptions'
import LoginButton from '@/components/common/LoginButton'

async function Login() {
  const session = await getServerSession(authOptions)

  return (
    <div className='rounded-custom glass-pane container m-auto flex max-w-fit select-none flex-col items-center justify-center p-8'>
      <h1 className='text-extrabold mb-2 text-3xl font-black tracking-wider text-pink-300 md:text-5xl'>
        Welcome to Zenify!
      </h1>
      <div className='mb-8'>
        <p className='text-xl'>an audio visualizer powered by Spotify Premium.</p>
      </div>
      {session !== null && (
        <div>
          <p className='mb-8 text-lg text-pink-50 '>You&apos;re already logged in and ready to go!</p>
        </div>
      )}
      <div className='flex'>
        {session ? (
          <button className='text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300'>
            <Link href='/'>Go to Zen-Player</Link>
          </button>
        ) : (
          <LoginButton />
        )}
        <button className='text-md mb-2 px-4 py-2 font-extrabold text-pink-50 underline underline-offset-2 transition-colors duration-500 ease-in-out hover:text-pink-300'>
          <Link href='/info'>Learn About Zenify</Link>
        </button>
      </div>
    </div>
  )
}

export default Login
