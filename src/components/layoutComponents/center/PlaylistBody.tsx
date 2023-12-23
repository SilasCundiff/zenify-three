'use client'

import { useSelectedSongStore } from '@/helpers/hooks'
import PlaylistTrackItem from './PlaylistTrackItem'

const PlaylistBody = ({ playlistData }) => {
  const { tracks, uri } = playlistData
  const { setSelectedSong } = useSelectedSongStore()

  const handleSelectTrack = (track, offset) => {
    setSelectedSong({ ...track, offset, context: { type: 'playlist', uri } })
  }

  return (
    <div className='flex max-h-[900px] flex-col gap-y-2 overflow-y-auto p-4'>
      {tracks.items.map(({ track }, i: number) => {
        return (
          <div key={track.id} onClick={() => handleSelectTrack(track, i)}>
            <PlaylistTrackItem track={track} order={i} />
          </div>
        )
      })}
    </div>
  )
}

export default PlaylistBody
