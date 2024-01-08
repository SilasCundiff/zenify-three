'use client'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

const PlaylistHeader = ({ playlistData }) => {
  const { name, description, images } = playlistData
  const [imgSrc, setImgSrc] = useState(images[0]?.url)
  const headerRef = useRef(null)

  useEffect(() => {
    const node = headerRef.current
    gsap.to(node, { autoAlpha: 1, duration: 0.5, ease: 'power2.in' })

    return () => {
      gsap.to(node, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
    }
  }, [])

  return (
    <div className='flex flex-wrap p-2 opacity-0' ref={headerRef}>
      <div className='my-auto shrink-0 '>
        <Image
          src={imgSrc ? imgSrc : '/img/album-placeholder-64.png'}
          className='rounded-custom h-16 w-16 md:h-20 md:w-20'
          alt='playlist cover'
          height={320}
          width={320}
          placeholder='blur'
          blurDataURL={'/img/album-placeholder-64.png'}
          onError={() => {
            setImgSrc('/img/album-placeholder-64.png')
          }}
        />
      </div>
      <div className=''>
        <p className='mb-1 ml-2 text-xl font-bold text-pink-50 md:text-2xl'>
          {description ? description : 'Playlist:'}
        </p>
        <h1 className='mb-2 ml-2 text-3xl font-bold text-pink-50 md:text-5xl'>{name}</h1>
      </div>
    </div>
  )
}

export default PlaylistHeader
