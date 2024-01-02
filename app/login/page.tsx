import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/helpers/authOptions'
import LoginButton from '@/components/common/LoginButton'

async function Login() {
  const session = await getServerSession(authOptions)

  return (
    <div className='container m-auto flex flex-col items-center justify-center '>
      <h1 className='text-extrabold mb-2 text-3xl text-white'>Welcome to Zenify!</h1>
      <div className='mb-8'>
        <p>Zenify is an audio visualizer powered by Spotify Premium.</p>
      </div>
      {session !== null && (
        <div>
          <p className='mb-8 text-lg text-white '>You&apos;re already logged in and ready to go!</p>
        </div>
      )}
      <div className='flex'>
        {session ? (
          <button className='text-md mb-2 px-4 py-3 font-extrabold text-white underline underline-offset-2'>
            <Link href='/'>Go to Zen-Player</Link>
          </button>
        ) : (
          <LoginButton />
        )}
        <button className='text-md mb-2 px-4 py-3 font-extrabold text-white underline underline-offset-2'>
          <Link href='/welcome'>Learn About Zenify</Link>
        </button>
      </div>
    </div>
  )
}

export default Login
