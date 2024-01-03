'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const PlaylistHeader = ({ playlistData }) => {
  const { name, description, images } = playlistData
  const [imgSrc, setImgSrc] = useState(images[0]?.url)

  return (
    <div className='flex flex-wrap p-2'>
      <div className='my-auto shrink-0 '>
        <Image
          src={imgSrc ? imgSrc : '/img/album-placeholder-64.png'}
          className='rounded-custom h-16 w-16 md:h-20 md:w-20'
          alt='playlist cover'
          height={80}
          width={80}
          placeholder='blur'
          blurDataURL={'/img/album-placeholder-64.png'}
          onError={() => {
            setImgSrc('/img/album-placeholder-64.png')
          }}
        />
      </div>
      <div className=''>
        <p className='mb-1 ml-2 text-xl font-bold text-white md:text-2xl'>{description ? description : 'Playlist:'}</p>
        <h1 className='mb-2 ml-2 text-3xl font-bold text-white md:text-5xl'>{name}</h1>
      </div>
    </div>
  )
}

export default PlaylistHeader
