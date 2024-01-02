'use client'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useSpotifyWebSDK } from '@/helpers/hooks'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function PlaybackInfoPane() {
  const { player, playerState } = useSpotifyWebSDK()
  const [songData, setSongData] = useState(null)

  useEffect(() => {
    if (playerState?.track_window.current_track) {
      setSongData(playerState?.track_window.current_track)
    }
  }, [playerState])

  if (!songData || songData?.id === null) {
    return (
      <div className='glass-pane rounded-custom m-2 flex h-24 min-w-60 items-center justify-center space-x-2 overflow-hidden pr-4 md:m-0 md:max-w-fit md:space-x-4'>
        <div className='p-4'>
          <LoadingSpinner size='large' />
        </div>
      </div>
    )
  }

  return (
    <div className='glass-pane rounded-custom m-2 flex h-24 items-center space-x-2 overflow-hidden pr-4 md:m-0 md:max-w-fit md:space-x-4 '>
      {songData && (
        <>
          <Image
            className='rounded-custom h-24 w-24 rounded-r-none md:inline'
            src={songData.album && songData?.album.images?.[0]?.url}
            alt='album cover'
            height={64}
            width={64}
          />
          <div>
            <h3 className='text-md font-bold text-gray-50 md:text-xl'>{songData?.name}</h3>
            <p className='text-md text-gray-50 md:text-xl'>{songData?.artists?.[0]?.name}</p>
            <p className='md:text-md text-sm text-gray-300 md:inline'>{songData?.album?.name}</p>
          </div>
        </>
      )}
      {!songData && status === 'loading' && (
        <div className='p-4'>
          <LoadingSpinner size='small' />
        </div>
      )}
    </div>
  )
}
