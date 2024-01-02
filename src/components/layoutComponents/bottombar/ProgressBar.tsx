import { useCallback, useEffect, useRef, useState } from 'react'

export default function ProgressBar({ playerState, player }) {
  const progress = useRef(0)
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
    progress.current = newProgress
    player.seek((newProgress * playerState.duration) / 100)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000)
    const seconds = ((time % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`
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
    if (localPlayerState && !localPlayerState.paused && playerState) {
      const interval = setInterval(() => {
        setLocalPlayerState((prevState) => ({
          ...prevState,
          position: prevState.position + 1000,
          updateTime: performance.now(),
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [localPlayerState, playerState])

  useEffect(() => {
    const newProgress = (getStatePosition() / localPlayerState.duration) * 100
    if (newProgress !== progress.current) {
      progress.current = newProgress
    }
  }, [localPlayerState, getStatePosition])

  return (
    <div className='scrubber mt-2'>
      <div className='scrubber-time flex items-center justify-between text-sm text-gray-300'>
        <span className='min-w-8 shrink-0 text-center'>{formatTime(getStatePosition())}</span>
        <input
          type='range'
          min='0'
          max='100'
          value={progress.current || 0}
          onChange={handleProgressChange}
          className='scrubber-progress mt-0.5 flex-1'
        />
        <span className='min-w-8 shrink-0 text-center'>{formatTime(localPlayerState.duration)}</span>
      </div>
    </div>
  )
}
