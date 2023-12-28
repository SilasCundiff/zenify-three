'use client'
import { useSpotifyApi, useSpotifyWebSDK } from '@/helpers/hooks'
import { useFrame } from '@react-three/fiber'
import { use, useEffect, useRef, useState } from 'react'

export default function SimplePlayer() {
  const { player, playerState } = useSpotifyWebSDK()
  const prevTrackNameRef = useRef()
  const spotifyApi = useSpotifyApi()
  const [nowPlaying, setNowPlaying] = useState(null)
  const [isActive, setIsActive] = useState(false)

  const playSpecificSongForTesting = async () => {
    const token = await spotifyApi.getAccessToken()
    const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: ['spotify:track:2rydyLno74qVE2qxUr5XTE'],
      }),
    })
  }

  const handleClick = () => {
    playSpecificSongForTesting()
  }

  useEffect(() => {
    const currentTrackName = playerState?.track_window.current_track.name

    // update the isActive state
    if (playerState) {
      if (playerState.paused) {
        setIsActive(false)
      } else {
        setIsActive(true)
      }
    }

    if (playerState && prevTrackNameRef.current !== currentTrackName) {
      setNowPlaying(currentTrackName)
    }
    prevTrackNameRef.current = currentTrackName
  }, [playerState])

  return (
    <div>
      <div className='flex h-screen w-full flex-col items-center justify-center bg-transparent  text-white'>
        <div>
          <button className='m-2 rounded-lg bg-green-300 px-4 py-2 text-black' onClick={() => player.togglePlay()}>
            {playerState?.paused ? 'Play' : 'Pause'}
          </button>
          <button className='m-2 rounded-lg bg-green-300 px-4 py-2 text-black' onClick={() => handleClick()}>
            Void Surfacing
          </button>
        </div>
        <p>Now Playing: {nowPlaying}</p>
      </div>
    </div>
  )
}
