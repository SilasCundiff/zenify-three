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
} from '@fortawesome/free-solid-svg-icons'

import { useCallback, useEffect, useRef, useState } from 'react'

import ProgressBar from './ProgressBar'
import { useUI } from '@/helpers/hooks/useUI'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const Player = () => {
  const { player, playerState } = useSpotifyWebSDK()
  const { uiHidden, setUiHidden } = useUI()
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

  const handlePreviousTrack = () => {
    player.previousTrack()
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

  const debouncedVolumeChange = useCallback(
    (volume: number) => {
      const debounced = debounce(() => {
        if (!spotifyApi || !playerState) {
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

  if (!playerState || playerState.loading) {
    return (
      <div className='glass-pane md:rounded-custom mx-auto flex h-24 min-h-24 w-full max-w-lg shrink-0 rounded-none p-2 text-xs md:text-base'>
        <p className='m-auto flex'>
          <LoadingSpinner size='small' />
          <span className='ml-4'>Connecting your player 📻</span>
        </p>
      </div>
    )
  }

  return (
    <div
      className={`${
        uiHidden ? 'opacity-10' : 'opacity-100'
      } glass-pane md:rounded-custom mx-auto h-24 w-full max-w-lg rounded-none p-2 text-xs transition-opacity duration-500 hover:opacity-100 md:text-base`}
    >
      {playerState && !playerState.loading && <ProgressBar playerState={playerState} player={player} />}
      <div className='button-controls grid grid-cols-[88px_1fr_88px] bg-transparent py-2 md:grid-cols-[96px_1fr_96px]'>
        <div className='col-start-1 flex items-center '>
          {uiHidden ? (
            <button
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
              onClick={() => {
                setUiHidden(true)
              }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          )}
        </div>
        <div className='col-start-2 flex items-center justify-center space-x-4  md:space-x-8 md:px-2'>
          <FontAwesomeIcon icon={faShuffle} className='button h-4 w-4 md:h-5 md:w-5' onClick={toggleShuffle} />
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
            <FontAwesomeIcon
              icon={faForwardStep}
              className='button h-6 w-6 md:h-7 md:w-7'
              onClick={() => player.nextTrack()}
            />
          </div>
          <FontAwesomeIcon icon={faRepeat} className='button h-4 w-4 md:h-5 md:w-5' onClick={toggleRepeat} />
        </div>
        <div className=' mr-1 flex items-center justify-end space-x-2'>
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
