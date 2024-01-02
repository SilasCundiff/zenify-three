import { useSession, signIn } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import spotifyApi from '@/helpers/spotify'
import { create } from 'zustand'

type TokenState = {
  accessToken: string
  refreshToken: string
}

type TokenActions = {
  setBothTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (accessToken: string) => void
  setRefreshToken: (refreshToken: string) => void
  getAccessToken: () => string
  getRefreshToken: () => string
}

type TokenStore = TokenState & TokenActions

export const useTokenStore = create<TokenStore>((set, get) => ({
  accessToken: '',
  refreshToken: '',
  setBothTokens: (accessToken, refreshToken) => set(() => ({ accessToken, refreshToken })),
  setAccessToken: (accessToken) => set(() => ({ accessToken })),
  setRefreshToken: (refreshToken) => set(() => ({ refreshToken })),
  getAccessToken: () => get().accessToken,
  getRefreshToken: () => get().refreshToken,
}))

type SpotifyPlayerState = {
  player: Spotify.Player | null
  playerState: Spotify.PlaybackState | null
}

type SpotifyPlayerActions = {
  setPlayer: (player: Spotify.Player | null) => void
  setPlayerState: (playerState: Spotify.PlaybackState | null) => void
  getPlayer: () => Spotify.Player | null
  getPlayerState: () => Spotify.PlaybackState | null
}

type SpotifyPlayerStore = SpotifyPlayerState & SpotifyPlayerActions

const useSpotifyPlayerStore = create<SpotifyPlayerStore>((set, get) => ({
  player: null,
  playerState: null,
  setPlayer: (player) => set(() => ({ player })),
  setPlayerState: (playerState) => set(() => ({ playerState })),
  getPlayer: () => get().player,
  getPlayerState: () => get().playerState,
}))

/**A
 * @returns {SpotifyWebApi} An instance of the SpotifyWebApi object with the access token set.
 *
 * @example
 * const spotifyApi = useSpotify();
 * const accessToken = spotifyApi.getAccessToken();
 */
export const useSpotifyApi = () => {
  const { data: session, status } = useSession()
  const { setBothTokens } = useTokenStore()

  useEffect(() => {
    if (session) {
      if (session.error === 'Failed to refresh access token') {
        signIn()
      }
      spotifyApi.setAccessToken(session.accessToken)
      spotifyApi.setRefreshToken(session.refreshToken)
      setBothTokens(session.accessToken, session.refreshToken)
    }
  }, [session, setBothTokens])

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
  const { player, playerState, setPlayer, setPlayerState } = useSpotifyPlayerStore()

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

    player.addListener('initialization_error', ({ message }) => {
      console.error(message)
    })

    player.addListener('ready', async ({ device_id }) => {
      const devices = await spotifyApi.getMyDevices()

      // find the device id of the web player
      const webPlayer = devices.body.devices.find((device) => device.id === device_id)

      // transfer playback to the web player
      if (!webPlayer) {
        return
      }
      spotifyApi.transferMyPlayback([webPlayer.id]).catch((err) => {
        console.error(err)
      })
      spotifyApi.setVolume(1, { device_id: webPlayer.id }).catch((err) => {
        console.error(err)
      })
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
  }, [token, isReady, spotifyApi, setPlayer, setPlayerState])

  return { player, playerState }
}

// export const useSpotifySongAnalysis = () => {
//   const spotifyApi = useSpotifyApi()
//   const { playerState } = useSpotifyWebSDK()
//   const [analysis, setAnalysis] = useState(null)
//   const [features, setFeatures] = useState(null)
//   const currentSongRef = useRef(null)

//   const getAnalysis = useCallback(
//     async (songId) => {
//       const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
//       const features = await spotifyApi.getAudioFeaturesForTrack(songId)

//       setAnalysis(analysis)
//       setFeatures(features)
//     },
//     [spotifyApi],
//   )

//   useEffect(() => {
//     if (!playerState) return

//     const songId = playerState?.track_window?.current_track?.id

//     if (!songId) return

//     if (songId !== currentSongRef.current) {
//       currentSongRef.current = songId
//       getAnalysis(songId)
//     }
//   }, [playerState, getAnalysis])

//   return { analysis, features }
// }
