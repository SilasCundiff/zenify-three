import { usePlaybackStore } from '@/helpers/hooks'
import Player from './Player'
import { useSession } from 'next-auth/react'
import spotifyApi from '@/helpers/spotify'

function Bottombar() {
  const playbackStore = usePlaybackStore()
  const token = spotifyApi.getAccessToken()
  console.log('this is a test', playbackStore.testFunc(token))

  return (
    <>
      <Player />
      <h1>temp</h1>
    </>
  )
}

export default Bottombar
