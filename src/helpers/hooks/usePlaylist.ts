import { create } from 'zustand'
import { Playlist } from '@/types'

type PlaylistState = {
  playlist: Playlist | { id: null | string }
  setPlaylist: (playlistData) => void
}

export const useSelectedPlaylistStore = create<PlaylistState>((set) => ({
  playlist: { id: null },
  setPlaylist: (playlistId: string) => set({ playlist: { id: playlistId } }),
}))
