/* eslint-disable tailwindcss/no-custom-classname */
'use client'
import { RefreshIcon, SwitchHorizontalIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { debounce } from 'lodash'
import { useSpotifyApi, useSpotifyWebSDK } from '@/helpers/hooks'
import NowPlayingInfo from './PlaybackInfoPane'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon } from '@heroicons/react/solid'

const Player = () => {
  const { player, playerState } = useSpotifyWebSDK()
  const spotifyApi = useSpotifyApi()
  const [volume, setVolume] = useState(1)
  const prevVolumeRef = useRef(1)

  const handleVolumeChange = (value) => {
    setVolume(value)
  }

  const handleMuteVolume = () => {
    if (volume > 0) {
      prevVolumeRef.current = volume
      setVolume(0)
    } else {
      setVolume(prevVolumeRef.current)
    }
  }

  // toggle the shuffle state using the spotifyApi
  const toggleShuffle = () => {
    console.log('toggleShuffle')
    spotifyApi.setShuffle(!playerState.shuffle).catch((err) => {
      console.log(err)
    })
  }

  const toggleRepeat = () => {
    console.log('toggleRepeat')
    if (playerState.repeat_mode === 0) {
      spotifyApi.setRepeat('context').catch((err) => {
        console.log(err)
      })
    }

    if (playerState.repeat_mode === 1) {
      spotifyApi.setRepeat('track').catch((err) => {
        console.log(err)
      })
    }

    if (playerState.repeat_mode === 2) {
      spotifyApi.setRepeat('off').catch((err) => {
        console.log(err)
      })
    }
  }

  const debouncedVolumeChange = useCallback(
    (volume: number) => {
      const debounced = debounce(() => {
        spotifyApi?.setVolume(volume).catch((err) => {
          console.log(err)
        })
      }, 500)
      debounced()
    },
    [spotifyApi],
  )

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedVolumeChange(volume)
    }
  }, [volume, debouncedVolumeChange])

  if (!player) {
    return (
      <div className='flex w-full shrink-0 px-2 text-xs md:px-6 md:text-base'>
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
      <div className='glass-pane w-fit p-2 text-xs md:px-6 md:text-base'>
        <ProgressBar />

        <div className='button-controls flex'>
          <SwitchHorizontalIcon className='button h-10 w-10' onClick={toggleShuffle} />
          <div className='flex w-full items-center justify-center text-4xl '>
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
          <RefreshIcon className='button h-10 w-10' onClick={toggleRepeat} />
          <div className=' flex items-center justify-end space-x-2 md:space-x-4'>
            <VolumeDownIcon className='button' onClick={handleMuteVolume} />
            <input
              className='volume-slider w-12 md:w-28 '
              type='range'
              value={volume}
              min={0}
              max={100}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player

// extrack the progress bar into its own component so the entire player doesn't rerender on progress change
const ProgressBar = () => {
  const { playerState, player } = useSpotifyWebSDK()
  const [progress, setProgress] = useState(0)
  const [localPlayerState, setLocalPlayerState] = useState({
    paused: true,
    position: 0,
    duration: 0,
    updateTime: null,
  })

  const getStatePosition = useCallback(() => {
    if (localPlayerState.paused) {
      return localPlayerState.position ? localPlayerState.position : 0
    }
    const position = localPlayerState.position + (performance.now() - localPlayerState.updateTime)
    return Math.floor(position > localPlayerState.duration ? localPlayerState.duration : position)
  }, [localPlayerState])

  const handleProgressChange = (event) => {
    const newProgress = event.target.value
    setProgress(newProgress)
    player.seek((newProgress * playerState.duration) / 100)
  }

  useEffect(() => {
    if (playerState) {
      setLocalPlayerState({
        paused: playerState.paused,
        position: playerState.position,
        duration: playerState.duration,
        updateTime: performance.now(),
      })
    }
  }, [playerState])

  useEffect(() => {
    if (localPlayerState && !localPlayerState.paused) {
      const interval = setInterval(() => {
        setLocalPlayerState((prevState) => ({
          ...prevState,
          position: prevState.position + 1000,
          updateTime: performance.now(),
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [localPlayerState])

  useEffect(() => {
    if (playerState) {
      setProgress((getStatePosition() / playerState.duration) * 100)
    }
  }, [playerState, localPlayerState, getStatePosition])

  return (
    <div className='scrubber w-full'>
      <input
        type='range'
        min='0'
        max='100'
        value={progress}
        onChange={handleProgressChange}
        className='scrubber-progress h-4 rounded-full bg-white transition-all duration-1000'
      />
    </div>
  )
}
