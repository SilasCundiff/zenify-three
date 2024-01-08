'use client'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useSpotifyWebSDK } from '@/helpers/hooks'
import { useUI } from '@/helpers/hooks/useUI'
import gsap from 'gsap'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function PlaybackInfoPane() {
  const { playerState } = useSpotifyWebSDK()
  const [songData, setSongData] = useState(null)
  const { uiHidden } = useUI()
  const playbackPaneRef = useRef(null)

  useEffect(() => {
    if (playerState?.track_window.current_track) {
      setSongData(playerState?.track_window.current_track)
    }
  }, [playerState])

  useEffect(() => {
    const node = playbackPaneRef.current
    gsap.to(node, { x: 0, duration: 0.5, ease: 'power2.out' })

    return () => {
      gsap.to(node, { x: 0, duration: 0.5, ease: 'power2.in' })
    }
  }, [songData])

  if (!songData || songData?.id === null) {
    return (
      <div className='rounded-custom m-2 flex h-24 min-w-60 items-center justify-center space-x-2 overflow-hidden pr-4 opacity-0 md:m-0 md:max-w-fit md:space-x-4'>
        <div className='p-4'></div>
      </div>
    )
  }

  return (
    <div
      ref={playbackPaneRef}
      className={`${
        uiHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      } glass-pane rounded-custom m-2 flex h-24 translate-x-[-200px] items-center space-x-2 overflow-hidden pr-4 transition-opacity duration-500 md:m-0 md:max-w-fit md:space-x-4`}
    >
      {songData && (
        <>
          <Image
            className='rounded-custom h-24 w-24 rounded-r-none md:inline'
            src={songData.album && songData?.album.images?.[0]?.url}
            alt='album cover'
            height={320}
            width={320}
          />
          <div className='overflow-hidden text-nowrap'>
            <h3 className='text-md truncate font-bold text-pink-50 md:text-xl'>{songData?.name}</h3>
            <p className='text-md truncate text-pink-50 md:text-xl'>{songData?.artists?.[0]?.name}</p>
            <p className='md:text-md text-sm text-pink-200 md:inline'>{songData?.album?.name}</p>
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
