'use client'
import { useSpotifyApi, useSpotifySongAnalysis, useSpotifyWebSDK } from '@/helpers/hooks'
import { use, useEffect, useRef, useState } from 'react'

export default function SimplePlayer() {
  const { player, playerState } = useSpotifyWebSDK()
  const prevTrackNameRef = useRef()
  const spotifyApi = useSpotifyApi()
  const [nowPlaying, setNowPlaying] = useState(null)
  const { analysis, features } = useSpotifySongAnalysis()

  console.dir({ analysis, features }, { depth: null, colors: true })

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
    if (playerState && prevTrackNameRef.current !== currentTrackName) {
      setNowPlaying(currentTrackName)
    }
    prevTrackNameRef.current = currentTrackName
  }, [playerState])

  return (
    <div>
      <div className='flex h-screen w-full flex-col items-center justify-center bg-black text-white'>
        <button onClick={() => player.togglePlay()}>{playerState?.paused ? 'Play' : 'Pause'}</button>
        <button className='text-white' onClick={() => handleClick()}>
          Void Surfacing
        </button>
        <p>Now Playing: {nowPlaying}</p>
      </div>
    </div>
  )
}
