import Image from 'next/image'

const PlaylistHeader = ({ playlistData }) => {
  const { name, description, images } = playlistData

  return (
    <div className='flex flex-wrap p-2'>
      <div className='my-auto shrink-0'>
        <Image
          src={images[0]?.url}
          className='h-20 w-20'
          alt='playlist cover'
          height={80}
          width={80}
          placeholder='blur'
          blurDataURL={'/images/album-placeholder-64.png'}
        />
      </div>
      <div className=''>
        <p className='mb-1 ml-2 text-2xl font-bold text-white'>{description ? description : 'Playlist'}</p>
        <h1 className='mb-2 ml-2 text-5xl font-bold text-white'>{name}</h1>
      </div>
    </div>
  )
}

export default PlaylistHeader
