'use client'

import { useSelectedSongStore } from '@/helpers/hooks'
import PlaylistTrackItem from './PlaylistTrackItem'
import spotifyApi from '@/helpers/spotify'

const PlaylistBody = ({ playlistData }) => {
  const { tracks, uri } = playlistData

  const handleSelectTrack = (track, offset) => {
    playSelectedSong({ ...track, offset, context: { type: 'playlist', uri } })
  }
  const playSelectedSong = async (selectedSong) => {
    spotifyApi
      .play({
        context_uri: selectedSong?.context.uri,
        offset: { position: selectedSong?.offset },
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='flex min-h-min flex-col gap-y-2 overflow-y-auto p-2'>
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
