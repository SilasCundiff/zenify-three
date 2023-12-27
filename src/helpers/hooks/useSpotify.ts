import { useSession, signIn } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import spotifyApi from '@/helpers/spotify'

/**A
 * @returns {SpotifyWebApi} An instance of the SpotifyWebApi object with the access token set.
 *
 * @example
 * const spotifyApi = useSpotify();
 * const accessToken = spotifyApi.getAccessToken();
 */
export const useSpotifyApi = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      if (session.error === 'Failed to refresh access token') {
        signIn()
      }

      spotifyApi.setAccessToken(session.accessToken)
    }
  }, [session])

  return spotifyApi
}

/**
 * @returns {Object} An object containing the Spotify Player object and the Spotify Player State object.
 *
 * The Spotify Player object has methods like player.togglePlay(), player.nextTrack(), etc.
 * The Spotify Player State object has properties like playerState.track_window.current_track.name, playerState.paused, etc.
 *
 * @example
 * const { player, playerState } = useSpotifyWebSDK();
 * player.togglePlay();
 * console.log(playerState.track_window.current_track.name);
 */
export const useSpotifyWebSDK = () => {
  const spotifyApi = useSpotifyApi()
  const token = spotifyApi.getAccessToken()
  const [isReady, setIsReady] = useState(false)
  // the player object, has methods like player.togglePlay(), player.nextTrack(), etc.
  const [player, setPlayer] = useState(null)
  // the player state, has properties like playerState.track_window.current_track.name, playerState.paused, etc.
  const [playerState, setPlayerState] = useState(null)
  const [playbackData, setPlaybackData] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [features, setFeatures] = useState(null)
  const currentSongRef = useRef(null)

  const getAnalysis = useCallback(
    async (songId) => {
      const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
      const features = await spotifyApi.getAudioFeaturesForTrack(songId)
      const playbackData = await spotifyApi.getMyCurrentPlaybackState()

      setAnalysis(analysis.body)
      setFeatures(features.body)
      setPlaybackData(playbackData.body)
    },
    [spotifyApi],
  )

  useEffect(() => {
    // prevent duplicate script injection
    if (window.Spotify || document.querySelector('.spotify-player')) return

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    script.className = 'spotify-player'

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsReady(true)
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!token || !window.Spotify) return

    const player = new window.Spotify.Player({
      name: 'Zenify',
      getOAuthToken: (cb) => {
        cb(token)
      },
      volume: 0.01,
    })

    player.setVolume(0.01)
    player.addListener('ready', ({ device_id }) => {
      spotifyApi.transferMyPlayback([device_id])

      spotifyApi.setVolume(1, { device_id })
    })

    // TODO: possibly use this to update UI
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline')
    })

    player.addListener('player_state_changed', (state) => {
      if (!state) {
        return
      }

      player.getCurrentState().then((state) => {
        setPlayerState(state)
      })
    })
    setPlayer(player)

    player.connect()

    return () => {
      player.disconnect()
    }
  }, [token, isReady, spotifyApi])

  useEffect(() => {
    // if the player is paused, don't make the request
    if (!playerState) return

    const songId = playerState?.track_window?.current_track?.id

    if (!songId) return
    if (!playerState?.paused) return

    if (songId !== currentSongRef.current || !playerState?.paused || !spotifyApi) {
      currentSongRef.current = songId
      getAnalysis(songId)
    }
  }, [playerState, getAnalysis, spotifyApi])

  return { player, playerState, analysis, features, playbackData }
}

// export const useSpotifySongAnalysis = (playerState) => {
//   const spotifyApi = useSpotifyApi()
//   const [analysis, setAnalysis] = useState(null)
//   const [features, setFeatures] = useState(null)
//   const currentSongRef = useRef(null)

//   const getAnalysis = useCallback(
//     async (songId) => {
//       const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
//       const features = await spotifyApi.getAudioFeaturesForTrack(songId)
//       // const playbackData = await spotifyApi.getMyCurrentPlaybackData()

//       setAnalysis(analysis.body)
//       setFeatures(features.body)
//     },
//     [spotifyApi],
//   )

//   useEffect(() => {
//     // if the player is paused, don't make the request
//     if (!playerState) return
//     console.log('playerState update in use song analysis', playerState)

//     const songId = playerState?.track_window?.current_track?.id

//     // setPaused(playerState?.paused)

//     if (!songId) return
//     if (!playerState?.paused) return

//     if (songId !== currentSongRef.current || !playerState?.paused) {
//       currentSongRef.current = songId
//       getAnalysis(songId)
//     }
//   }, [playerState, getAnalysis])

//   return { analysis, features }
// }
