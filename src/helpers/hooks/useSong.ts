import { create } from 'zustand'
import { TrackDetails, PlaybackSong } from '@/types'

type SelectedPlaylistState = {
  selectedSong:
    | TrackDetails
    | {
        id: null | string
        uri: string | null
        offset: number | null
        context: {
          type: string
          uri: string
        } | null
      }
  setSelectedSong: (selectedSongInfo: TrackDetails) => void
}

export const useSelectedSongStore = create<SelectedPlaylistState>((set) => ({
  selectedSong: { id: null, uri: null, offset: null, context: null },
  setSelectedSong: (selectedSongInfo) => set({ selectedSong: selectedSongInfo }),
}))

type PlaybackState = {
  nowPlaying: PlaybackSong | { id: null | string }
  isPlaying: boolean
  isActive: boolean
  setNowPlaying: (nowPlaying: PlaybackSong) => void
  setIsPlaying: (isPlaying: boolean) => void
  setIsActive: (isActive: boolean) => void
  testFunc: (token: string) => void
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  nowPlaying: { id: null },
  isPlaying: false,
  isActive: false,
  setNowPlaying: (nowPlaying) => set({ nowPlaying }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsActive: (isActive) => set({ isActive }),
  testFunc: (token) => tempFunc(token),
}))

const tempFunc = async (token: string) => {
  const res = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()

  // console.log('this is the data in the temp func', data)
}
