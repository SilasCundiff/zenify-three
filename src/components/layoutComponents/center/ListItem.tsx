'use client'
import { useSelectedPlaylistStore } from '@/helpers/hooks'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ListItem = ({ playlistId, playlistTitle, playlistImageUrl }) => {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()
  const [imgSrc, setImgSrc] = useState(playlistImageUrl)

  useEffect(() => {
    setImgSrc(playlistImageUrl)
  }, [playlistImageUrl])

  const handleSelectPlaylist = () => {
    if (playlistId === playlist?.id) return
    setPlaylist(playlistId)
  }

  return (
    <li
      className='rounded-custom flex min-w-16 max-w-16 cursor-pointer flex-col whitespace-nowrap rounded-b-none align-middle text-sm font-bold hover:text-gray-300 md:min-w-48 md:max-w-48 md:text-lg'
      onClick={handleSelectPlaylist}
    >
      {playlistImageUrl ? (
        <Image
          src={imgSrc ? imgSrc : '/img/album-placeholder-64.png'}
          className='rounded-custom aspect-square w-full'
          alt='playlist cover'
          height={300}
          width={300}
          placeholder='blur'
          blurDataURL={'/img/album-placeholder-64.png'}
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
