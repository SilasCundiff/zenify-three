'use client'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useSpotifyWebSDK } from '@/helpers/hooks'
import { useUI } from '@/helpers/hooks/useUI'
import gsap from 'gsap'
import Image from 'next/image'
import { use, useEffect, useRef, useState } from 'react'

export default function PlaybackInfoPane() {
  const { playerState } = useSpotifyWebSDK()
  const [songData, setSongData] = useState(null)
  const { uiHidden } = useUI()
  const playbackPaneRef = useRef(null)
  const initialRender = useRef(false)

  useEffect(() => {
    if (playerState?.track_window.current_track) {
      setSongData(playerState?.track_window.current_track)
    }
  }, [playerState])

  useEffect(() => {
    if (initialRender.current === true) {
      return
    }
    // add a gsap animation to slide the playback pane in from the left and fade it in
    gsap.to(playbackPaneRef.current, { x: 0, duration: 0.5, ease: 'power2.out' })

    // set the initial render to true so that the animation doesn't run again
    initialRender.current = true

    // handle the cleanup of the gsap animation
    return () => {
      gsap.to(playbackPaneRef.current, { x: 0, duration: 0.5, ease: 'power2.in' })
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
      } glass-pane rounded-custom m-2 flex h-24 translate-x-[-400px] items-center space-x-2 overflow-hidden pr-4 transition-opacity duration-500 md:m-0 md:max-w-fit md:space-x-4`}
    >
      {songData && (
        <>
          <Image
            className='rounded-custom h-24 w-24 rounded-r-none md:inline'
            src={songData.album && songData?.album.images?.[0]?.url}
            alt='album cover'
            height={64}
            width={64}
          />
          <div className='overflow-hidden text-nowrap'>
            <h3 className='text-md truncate font-bold text-gray-50 md:text-xl'>{songData?.name}</h3>
            <p className='text-md truncate text-gray-50 md:text-xl'>{songData?.artists?.[0]?.name}</p>
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
