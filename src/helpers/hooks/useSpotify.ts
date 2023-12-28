import { useSession, signIn } from 'next-auth/react'
import { use, useCallback, useEffect, useRef, useState } from 'react'
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
  const deviceId = useRef(null)
  // const [playbackData, setPlaybackData] = useState(null)
  // const [analysis, setAnalysis] = useState(null)
  // const [features, setFeatures] = useState(null)
  // const currentSongRef = useRef(null)

  // const getAnalysis = useCallback(
  //   async (songId) => {
  //     const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
  //     const features = await spotifyApi.getAudioFeaturesForTrack(songId)
  //     const playbackData = await spotifyApi.getMyCurrentPlaybackState()

  //     setAnalysis(analysis.body)
  //     setFeatures(features.body)
  //     setPlaybackData(playbackData.body)
  //   },
  //   [spotifyApi],
  // )

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

    const setActiveDevice = async () => {
      console.log('setting active device')
      if (deviceId.current !== null) {
        const device_id = deviceId.current
        await spotifyApi.transferMyPlayback([device_id])
        await spotifyApi.setVolume(1, { device_id })
        console.log('active device set')
      }
      // if the device id is not set, call this function again after a timeout
      else {
        setTimeout(() => {
          setActiveDevice()
        }, 500)
      }
    }

    player.setVolume(0.01)
    player.addListener('ready', ({ device_id }) => {
      deviceId.current = device_id
      setActiveDevice()
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

  // useEffect(() => {
  //   // if the player is paused, don't make the request
  //   if (!playerState) return

  //   const songId = playerState?.track_window?.current_track?.id

  //   if (!songId) return
  //   if (!playerState?.paused) return
  //   console.log('spotifyAPI quick reference', spotifyApi)

  //   if (songId !== currentSongRef.current || !playerState?.paused || spotifyApi !== null) {
  //     currentSongRef.current = songId
  //     getAnalysis(songId)
  //   }
  // }, [playerState, getAnalysis, spotifyApi])

  // return { player, playerState, analysis, features, playbackData }
  return { player, playerState }
}

export const useSpotifySongAnalysis = () => {
  const { playerState } = useSpotifyWebSDK()
  const spotifyApi = useSpotifyApi()
  console.log('playerState in use song analysis', playerState)
  console.log('spotifyApi in use song analysis', spotifyApi)
  const [initialized, setInitialized] = useState(false)
  const [trackAnalysis, setTrackAnalysis] = useState(null)
  const [trackFeatures, setTrackFeatures] = useState(null)
  const [active, setActive] = useState(false)
  const [initialTrackProgress, setInitialTrackProgress] = useState(0)
  const [initialStart, setInitialStart] = useState(0)
  const [trackProgress, setTrackProgress] = useState(0)

  const [activeIntervals, setActiveIntervals] = useState({
    tatums: {},
    segments: {},
    beats: {},
    bars: {},
    sections: {},
  })
  // this may be redundant.
  const [currentPlayback, setCurrentPlayback] = useState(null)
  const currentSongRef = useRef(null)

  // get the current playback state
  const getPlayback = useCallback(async () => {
    const playbackData = await spotifyApi.getMyCurrentPlaybackState()
    setInitialized(true)

    // get if the players song and the current playback song are the same
    const songId = playerState?.track_window?.current_track?.id
    const currentPlaybackSongId = playbackData?.body?.item?.id
    const isSameSong = songId === currentPlaybackSongId

    // only set the playback data if the songs are different to prevent excessive analysis requests, or if the playback data is null
    if (!isSameSong || !currentPlayback) {
      setCurrentPlayback(playbackData.body)
    }
  }, [playerState, spotifyApi, currentPlayback])

  const getAnalysis = useCallback(
    async (songId) => {
      console.log('getting analysis', songId)
      const tick = window.performance.now()

      const analysis = await spotifyApi.getAudioAnalysisForTrack(songId)
      const features = await spotifyApi.getAudioFeaturesForTrack(songId)
      const intervalTypes = ['tatums', 'segments', 'beats', 'bars', 'sections']

      intervalTypes.forEach((intervalType) => {
        const type = analysis.body[intervalType]
        type[0].duration = type[0].start + type[0].duration
        type[0].start = 0
        type[type.length - 1].duration = currentPlayback.item.duration_ms / 1000 - type[type.length - 1].start
        type.forEach((interval) => {
          if (interval.loudness_max_time) {
            interval.loudness_max_time = interval.loudness_max_time * 1000
          }
          interval.start = interval.start * 1000
          interval.duration = interval.duration * 1000
        })
      })

      const tock = window.performance.now()

      setTrackAnalysis(analysis.body)
      setTrackFeatures(features.body)
      setInitialTrackProgress(currentPlayback.progress_ms + tock)
      setTrackProgress(currentPlayback.progress_ms + tock)
      setInitialStart(window.performance.now())

      console.log('analysis set')
      if (!active) {
        setActive(true)
      }
    },
    [spotifyApi, currentPlayback, active],
  )

  // use effect to retrieve the analysis and features of the current song any time the current song changes
  useEffect(() => {
    if (!currentPlayback) return
    getAnalysis(currentPlayback?.item?.id)
  }, [currentPlayback, getAnalysis])

  useEffect(() => {
    if (!playerState || !spotifyApi) return

    const songId = playerState?.track_window?.current_track?.id

    if (!songId) return

    if (!initialized || !playerState?.paused) {
      getPlayback()
    }
  }, [playerState, getPlayback, spotifyApi, initialized])

  console.log('==================================================')
  console.log('misc state')
  console.log('currentPlayback', currentPlayback)
  console.log('analysis', trackAnalysis)
  console.log('features', trackFeatures)

  return { trackAnalysis, trackFeatures, currentPlayback }
}
