'use client'
import { debounce } from 'lodash'
import { useSpotifyApi, useSpotifyWebSDK } from '@/helpers/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faShuffle,
  faPlay,
  faPause,
  faRepeat,
  faBackwardStep,
  faForwardStep,
  faEye,
  faEyeSlash,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import ProgressBar from './ProgressBar'
import { useUI } from '@/helpers/hooks/useUI'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useMouseMovement } from '@/helpers/hooks/useMouseMovement'

const Player = () => {
  const { player, playerState } = useSpotifyWebSDK()
  const { uiHidden, setUiHidden, hideCenterContentOnly, setHideCenterContentOnly } = useUI()
  const [spotifySessionDoesntExist, setSpotifySessionDoesntExist] = useState(false)
  const spotifyApi = useSpotifyApi()
  const [volume, setVolume] = useState(1)
  const prevVolumeRef = useRef(1)
  const playerRef = useRef(null)
  const mouseMoved = useMouseMovement()

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

  const handlePreviousTrack = () => {
    player.previousTrack()
  }

  const handleNextTrack = () => {
    if (playerState?.repeat_mode === 2) {
      player.seek(0)
      return
    }
    player.nextTrack()
  }

  const handleSeekBackward = () => {
    player.seek(0)
  }

  const toggleShuffle = () => {
    spotifyApi.setShuffle(!playerState.shuffle).catch((err) => {
      console.log(err)
    })
  }

  const toggleRepeat = () => {
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

  const handleHideCenterContent = () => {
    setHideCenterContentOnly(!hideCenterContentOnly)
  }

  const debouncedVolumeChange = useCallback(
    (volume: number) => {
      const debounced = debounce(() => {
        if (!spotifyApi || !playerState || playerState.loading) {
          return
        }
        spotifyApi?.setVolume(volume).catch((err) => {
          console.log(err)
        })
      }, 500)
      debounced()
    },
    [spotifyApi, playerState],
  )

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedVolumeChange(volume)
    }
  }, [volume, debouncedVolumeChange])

  // cleanup player
  useEffect(() => {
    return () => {
      if (player) {
        player.disconnect()
      }
    }
  }, [player])

  // if the player takes more than 5 seconds to load, display a message informing the user that they need to have an active spotify session
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (playerState?.loading && !playerState?.track_window.current_track) {
        setSpotifySessionDoesntExist(true)
      }
    }, 10000)
    return () => clearTimeout(timeout)
  }, [playerState])

  // if the player connects and is loaded, remove the message
  useEffect(() => {
    if (playerState?.loading === false && playerState?.track_window.current_track) {
      setSpotifySessionDoesntExist(false)
    }
  }, [playerState])

  // gsap animation to slide the player in from the bottom
  useEffect(() => {
    const node = playerRef.current
    gsap.to(node, { y: 0, duration: 1.5, ease: 'power2.out' })

    return () => {
      gsap.to(node, { y: 100, duration: 0.5, ease: 'power2.in' })
    }
  }, [])

  if (spotifySessionDoesntExist || (playerState?.loading && !playerState?.track_window.current_track)) {
    return (
      <div
        ref={playerRef}
        className='glass-pane md:rounded-custom mx-auto flex h-24 min-h-24 w-full max-w-lg shrink-0 translate-y-[200%] rounded-none p-2 text-xs md:text-base'
      >
        <p className='m-auto flex flex-col text-center text-sm'>
          <span className='ml-4'>You need to have an active Spotify session to use this feature!</span>
          <span className='ml-4'>
            Please <span className='text-pink-300'>open spotify</span> on any device and start a song,
          </span>
          <span className='ml-4'>
            then come back here and <span className='text-pink-300'>refresh the page</span>!
          </span>
        </p>
      </div>
    )
  }

  if (!playerState || playerState.loading) {
    return (
      <div
        ref={playerRef}
        className='glass-pane md:rounded-custom mx-auto flex h-24 min-h-24 w-full max-w-lg shrink-0 translate-y-[200%] rounded-none p-2 text-xs md:text-base'
      >
        <p className='m-auto flex'>
          <LoadingSpinner size='small' />
          <span className='ml-4'>Connecting your player 📻</span>
        </p>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className={`${
        uiHidden ? (mouseMoved ? 'opacity-25' : 'opacity-10 md:opacity-0') : 'opacity-100'
      } glass-pane md:rounded-custom mx-auto h-24 w-full max-w-lg rounded-none p-2 text-xs transition-opacity duration-500 hover:opacity-100 md:text-base`}
    >
      {playerState && !playerState.loading && <ProgressBar playerState={playerState} player={player} />}
      <div className='button-controls grid grid-cols-[88px_1fr_88px] bg-transparent py-2 md:grid-cols-[96px_1fr_96px]'>
        <div className='col-start-1 flex items-center '>
          {uiHidden ? (
            <button
              title='Show UI'
              className='button h-8 w-8 md:h-8 md:w-8'
              onClick={() => {
                setUiHidden(false)
              }}
            >
              <FontAwesomeIcon icon={faEyeSlash} />
            </button>
          ) : (
            <button
              className='button h-8 w-8 md:h-8 md:w-8'
              title='Hide UI'
              onClick={() => {
                setUiHidden(true)
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          )}
          {
            <button
              className={`${
                uiHidden ? 'invisible opacity-0' : 'visible opacity-100'
              } button h-8 w-8 transition-all duration-500 md:h-8 md:w-8`}
              onClick={handleHideCenterContent}
              title='Hide Center Display'
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
          }
        </div>
        <div className='col-start-2 flex items-center justify-center space-x-4  md:space-x-8 md:px-2'>
          <FontAwesomeIcon
            icon={faShuffle}
            className={`button h-4 w-4 md:h-5 md:w-5 ${playerState?.shuffle ? 'text-pink-300' : ''}`}
            onClick={toggleShuffle}
          />
          <div className='flex items-center  justify-center space-x-2 md:space-x-4'>
            <FontAwesomeIcon
              icon={faBackwardStep}
              className='button h-6 w-6 md:h-7 md:w-7'
              onClick={handleSeekBackward}
              onDoubleClick={handlePreviousTrack}
            />
            {playerState && !playerState.paused ? (
              <FontAwesomeIcon
                icon={faPause}
                className='button h-8 w-8 md:h-10 md:w-10'
                onClick={() => player.pause()}
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlay}
                className='button h-8 w-8 md:h-10 md:w-10'
                onClick={() => player.resume()}
              />
            )}
            <FontAwesomeIcon icon={faForwardStep} className='button h-6 w-6 md:h-7 md:w-7' onClick={handleNextTrack} />
          </div>
          <span className={`button relative ${playerState?.repeat_mode !== 0 ? 'text-pink-300' : ''}`}>
            <FontAwesomeIcon icon={faRepeat} className={`h-4 w-4 md:h-5 md:w-5 `} onClick={toggleRepeat} />
            <span className={`absolute -right-1 top-1 text-sm font-black text-pink-300`}>
              {playerState?.repeat_mode === 2 ? '1' : null}
            </span>
          </span>
        </div>
        <div className='mr-1 flex items-center justify-end space-x-2'>
          {volume > 50 && <FontAwesomeIcon icon={faVolumeHigh} className='button h-4 w-4' onClick={handleMuteVolume} />}
          {volume > 0 && volume <= 50 && (
            <FontAwesomeIcon icon={faVolumeLow} className='button h-4 w-4 md:h-4 md:w-4' onClick={handleMuteVolume} />
          )}
          {volume === 0 && (
            <FontAwesomeIcon icon={faVolumeXmark} className='button h-4 w-4 md:h-4 md:w-4' onClick={handleMuteVolume} />
          )}

          <input
            className='volume-slider '
            type='range'
            value={volume}
            title={`Volume: ${volume}`}
            min={0}
            max={100}
            step={1}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export default Player
