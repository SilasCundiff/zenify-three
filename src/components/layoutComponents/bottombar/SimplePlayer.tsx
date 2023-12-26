'use client'
import { useSpotifyWebSDK } from '@/helpers/hooks'

export default function SimplePlayer() {
  const { player, playerState } = useSpotifyWebSDK()

  return (
    <div>
      <div className='flex h-screen w-full flex-col items-center justify-center bg-black text-white'>
        <button onClick={() => player.togglePlay()}>{player?.isPlaying ? 'Pause' : 'Play'}</button>
        {playerState && (
          <div>
            <p>Playing {playerState?.track_window.current_track.name}</p>
            <p>by {playerState?.track_window.current_track.artists[0].name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
