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
    // player.addListener('not_ready', ({ device_id }) => {
    //   console.log('Device ID has gone offline')
    // })

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

  return { player, playerState }
}

export const useSpotifySongAnalysis = () => {
  const spotifyApi = useSpotifyApi()
  const { playerState } = useSpotifyWebSDK()
  const [analysis, setAnalysis] = useState(null)
  const [features, setFeatures] = useState(null)
  const currentSongRef = useRef(null)

  const getAnalysis = useCallback(
    async (songId) => {
      const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
      const features = await spotifyApi.getAudioFeaturesForTrack(songId)

      setAnalysis(analysis)
      setFeatures(features)
    },
    [spotifyApi],
  )

  useEffect(() => {
    if (!playerState) return

    const songId = playerState?.track_window?.current_track?.id

    if (!songId) return

    if (songId !== currentSongRef.current) {
      currentSongRef.current = songId
      getAnalysis(songId)
    }
  }, [playerState, getAnalysis])

  return { analysis, features }
}
