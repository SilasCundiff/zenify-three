'use client'
import Image from 'next/image'
import { convertMsToMinutes } from '@/helpers/utils/time'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const PlaylistTrackItem = ({ track, order }) => {
  const { id, name, album, artists, duration_ms, explicit, popularity, uri } = track
  const [imgSrc, setImgSrc] = useState(album.images[2].url)
  const itemRef = useRef(null)

  useEffect(() => {
    const node = itemRef.current
    gsap.fromTo(node, { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, delay: (order * 0.25) / 5, duration: 0.5 })

    return () => {
      gsap.fromTo(node, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 100, delay: (order * 0.25) / 5, duration: 0.5 })
    }
  }, [order])

  useEffect(() => {
    setImgSrc(album.images[2].url)
  }, [album])

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <div
      ref={itemRef}
      className='rounded-custom grid cursor-pointer grid-cols-2 px-5 py-4 text-gray-500  opacity-0 hover:bg-gray-800/30 hover:text-white'
    >
      <div className='flex items-center space-x-4'>
        <p className='flex max-w-[32px] text-lg  font-bold'>{order + 1}</p>
        <Image
          src={imgSrc ? imgSrc : '/img/album-placeholder-64.png'}
          className='rounded-custom h-10 w-10'
          alt='album cover'
          height={40}
          width={40}
          placeholder='blur'
          blurDataURL={'/img/album-placeholder-64.png'}
          onError={() => {
            setImgSrc('/img/album-placeholder-64.png')
          }}
        />
        <div className=''>
          <p className='w-36 truncate text-green-50'>{name}</p>
          <p className='w-40'>{artists[0].name}</p>
        </div>
      </div>
      <div className='ml-auto flex items-center justify-between md:ml-0'>
        <p className='hidden w-40 max-w-40 truncate text-nowrap md:inline md:w-full md:max-w-80'>{album.name}</p>
        <p className=' '>{convertMsToMinutes(duration_ms)}</p>
      </div>
    </div>
  )
}

export default PlaylistTrackItem
