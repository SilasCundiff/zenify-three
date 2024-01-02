import { create } from 'zustand'
import spotifyApi from '../spotify'

type tracksResponseData = {
  items: SpotifyApi.TrackObjectFull[]
  href: string
  limit: number
  next: string
  offset: number
  previous: string
  total: number
}

type SearchTracksStore = {
  tracksResponseData: null | tracksResponseData
  setTracksResponseData: (tracks: any, offset?: number) => void
  setResetTracksResponseData: () => void
}

export const useSearchTracksStore = create<SearchTracksStore>((set) => ({
  tracksResponseData: null,
  setTracksResponseData: async (search, offset = 0) =>
    spotifyApi.searchTracks(search, { offset }).then((data) => {
      if (data.body.tracks.items.length === 0) {
        return set({ tracksResponseData: null })
      }

      if (offset > 0) {
        return set({
          tracksResponseData: {
            ...data.body.tracks,
            // add new items to the end of the array while keeping the old ones
            items: [...(data.body.tracks.items as any)],
          },
        })
      }
      set({ tracksResponseData: data.body.tracks })
    }),
  setResetTracksResponseData: () => set({ tracksResponseData: null }),
}))
