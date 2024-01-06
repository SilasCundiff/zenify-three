'use client'
import { useSelectedPlaylistStore } from '@/helpers/hooks'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const ListItem = ({ playlistId, playlistTitle, playlistImageUrl, order }) => {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()
  const [imgSrc, setImgSrc] = useState(playlistImageUrl)
  const itemRef = useRef(null)

  const handleSelectPlaylist = () => {
    if (playlistId === playlist?.id) return
    setPlaylist(playlistId)
  }

  useEffect(() => {
    const node = itemRef.current
    gsap.to(node, { autoAlpha: 1, delay: (order * 0.5) / 15, duration: 0.5, ease: 'power2.in' })

    return () => {
      gsap.to(node, { autoAlpha: 0, delay: (order * 0.5) / 15, duration: 0.5, ease: 'power2.out' })
    }
  }, [order])

  return (
    <li
      ref={itemRef}
      className='rounded-custom flex min-w-16 max-w-16 cursor-pointer flex-col whitespace-nowrap rounded-b-none align-middle  text-sm font-bold opacity-0 duration-200 will-change-transform hover:scale-110 hover:text-gray-300 md:min-w-48 md:max-w-48 md:text-lg'
      onClick={handleSelectPlaylist}
    >
      {playlistImageUrl ? (
        <div
          className='rounded-custom aspect-square w-full bg-cover bg-center'
          style={{
            backgroundImage: `url(${imgSrc ? imgSrc : '/img/album-placeholder-64.png'})`,
          }}
          onError={() => {
            setImgSrc('/img/album-placeholder-64.png')
          }}
        />
      ) : (
        <div className='h-16 w-16 rounded-full bg-gray-700' />
      )}
      <div className='max-w-[48ch]'>
        <p className='truncate pt-1'>{playlistTitle}</p>
      </div>
    </li>
  )
}

export default ListItem
