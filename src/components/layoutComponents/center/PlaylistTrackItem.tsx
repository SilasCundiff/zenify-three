import Image from 'next/image'
import { convertMsToMinutes } from '@/helpers/time'

const PlaylistTrackItem = ({ track, order }) => {
  const { id, name, album, artists, duration_ms, explicit, popularity, uri } = track

  console.log('album.images[2].url', album.images[2].url)

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <div className='grid cursor-pointer grid-cols-2 rounded-lg px-5 py-4 text-gray-500 hover:bg-green-800 hover:bg-opacity-30 hover:text-white'>
      <div className='flex items-center space-x-4'>
        <p className='flex max-w-[32px] text-lg  font-bold'>{order + 1}</p>
        <Image src={album.images[2].url} className='h-10 w-10' alt='album cover' height={40} width={40} />
        <div className=''>
          <p className='w-36 truncate text-green-50'>{name}</p>
          <p className='w-40'>{artists[0].name}</p>
        </div>
      </div>
      <div className='ml-auto flex items-center justify-between md:ml-0'>
        <p className='hidden w-40 md:inline'>{album.name}</p>
        <p className=' '>{convertMsToMinutes(duration_ms)}</p>
      </div>
    </div>
  )
}

export default PlaylistTrackItem
