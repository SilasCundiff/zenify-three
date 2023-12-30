/* eslint-disable tailwindcss/no-custom-classname */
'use client'
import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { debounce } from 'lodash'
import { useSpotifyApi, useSpotifyWebSDK } from '@/helpers/hooks'
import NowPlayingInfo from './NowPlayingInfo'

import { useEffect, useRef, useState } from 'react'
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'

const Player = () => {
  const { player, playerState } = useSpotifyWebSDK()
  // const prevTrackNameRef = useRef('')
  // const [nowPlaying, setNowPlaying] = useState(null)

  // useEffect(() => {
  //   const currentTrackName = playerState?.track_window.current_track.name
  //   if (playerState && prevTrackNameRef.current !== currentTrackName) {
  //     setNowPlaying(currentTrackName)
  //   }
  //   prevTrackNameRef.current = currentTrackName
  // }, [playerState])

  if (!player) {
    return (
      <div className='flex h-24 min-h-24 w-full shrink-0 px-2 text-xs md:px-6 md:text-base '>
        <p className='m-auto'>
          Player not active, please open Spotify and select <span className='text-green-400'>Zenify</span> as your
          active device.
        </p>
      </div>
    )
  }

  // console.log('playerState', playerState, player)
  // console.log('nowPlaying', nowPlaying)
  // console.log('selectedSong', selectedSong)

  if (!playerState) {
    return (
      <div className='flex h-24 min-h-24 w-full shrink-0 px-2 text-xs md:px-6 md:text-base '>
        <p className='m-auto'>Fetching your jams 🎧</p>
      </div>
    )
  }

  return (
    <div>
      <div className='grid h-24 min-h-24 w-full shrink-0 grid-cols-3 px-2 text-xs md:px-6 md:text-base'>
        <NowPlayingInfo songData={playerState?.track_window.current_track} />
        <div className='flex w-full items-center justify-center text-4xl '>
          {/* <SwitchHorizontalIcon className='button' /> */}
          <div className='ml-8 mr-[64px] flex items-center  justify-center space-x-4'>
            <RewindIcon className='button h-10 w-10' onClick={() => player.previousTrack()} />
            {playerState && !playerState.paused ? (
              <PauseIcon className='button h-12 w-12' onClick={() => player.pause()} />
            ) : (
              <PlayIcon className='button h-12 w-12' onClick={() => player.resume()} />
            )}
            <FastForwardIcon className='button h-10 w-10' onClick={() => player.nextTrack()} />
          </div>
        </div>
        {/* <div className=' flex items-center justify-end space-x-3 pr-5 md:space-x-4'>
          <VolumeDownIcon className='button' onClick={handleVolumeDecrease} />
          <input
            className='volume-slider w-14 md:w-28'
            type='range'
            value={volume}
            min={0}
            max={100}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
          />
          <VolumeUpIcon className='button' onClick={handleVolumeIncrease} />
        </div> */}
      </div>
    </div>
  )
}

export default Player
