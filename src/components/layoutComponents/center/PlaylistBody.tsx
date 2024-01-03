'use client'
import PlaylistTrackItem from './PlaylistTrackItem'
import spotifyApi from '@/helpers/spotify'

const PlaylistBody = ({ playlistData }) => {
  const { tracks, uri } = playlistData
  console.log('playlistData', playlistData)

  const handleSelectTrack = (track, offset) => {
    playSelectedSong({ ...track, offset, context: { type: 'playlist', uri } })
  }
  const playSelectedSong = async (selectedSong) => {
    spotifyApi
      .play({
        context_uri: selectedSong?.context.uri,
        offset: { position: selectedSong?.offset },
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='flex max-h-[calc(100svh-364px)] min-h-min flex-col gap-y-2 overflow-y-auto p-2 md:max-h-[calc(100svh-372px)]'>
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
