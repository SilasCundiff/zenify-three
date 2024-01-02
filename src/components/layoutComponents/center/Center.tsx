'use client'
import { useEffect, useState } from 'react'
import { useSpotifyApi } from '@/helpers/hooks/useSpotify'
import { useSession } from 'next-auth/react'
import { useSelectedPlaylistStore } from '@/helpers/hooks/usePlaylist'
import PlaylistBody from './PlaylistBody'
import PlaylistHeader from './PlaylistHeader'
import Playlists from './Playlists'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSearchTracksStore } from '@/helpers/hooks/useSearch'
import PlaylistTrackItem from './PlaylistTrackItem'

function CenterContent() {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()
  const [playlistData, setPlaylistData] = useState(null)
  const spotifyApi = useSpotifyApi()
  const { status } = useSession()
  const { tracksResponseData, setResetTracksResponseData } = useSearchTracksStore()

  const handleClearPlaylist = () => {
    setPlaylist(null)
    setPlaylistData(null)
  }

  const handleClearSearchResults = () => {
    handleClearPlaylist()
    setResetTracksResponseData()
  }

  const handleSelectTrack = (track) => {
    const { uri } = track.album
    console.log('track', track.track_number)
    playSelectedSong({ ...track, offset: track.track_number - 1, context: { type: 'album', uri } })
  }

  const playSelectedSong = async (selectedSong) => {
    spotifyApi
      .play({
        context_uri: selectedSong?.context.uri,
        offset: { position: selectedSong?.offset },
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
  }

  useEffect(() => {
    if (playlist?.id) {
      spotifyApi
        .getPlaylist(playlist.id)
        .then((data) => {
          setPlaylistData(data.body)
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
        })
    }
  }, [playlist, spotifyApi, status])

  if (tracksResponseData) {
    return (
      <div className='flex flex-1 basis-full p-2 md:p-4'>
        <div className='rounded-custom no-scrollbar glass-pane container m-auto flex h-svh max-h-[calc(100vh-288px)] flex-1 basis-full flex-col overflow-y-auto p-4'>
          <button className='ml-0 mr-2 self-start hover:text-gray-300' onClick={handleClearSearchResults}>
            <span className='ml-2 mr-1'>
              <FontAwesomeIcon icon={faXmark} />
            </span>{' '}
            Clear search results
          </button>
          <div className='mt-4 flex flex-1 flex-col overflow-y-auto  '>
            {tracksResponseData?.items.map((item, index) => {
              return (
                <div key={item.id} onClick={() => handleSelectTrack(item)}>
                  <PlaylistTrackItem track={item} order={index} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!playlistData) {
    return (
      <div className='flex flex-1 basis-full p-2 md:p-4'>
        <div className='rounded-custom no-scrollbar glass-pane container m-auto h-svh max-h-[calc(100vh-288px)] flex-1 basis-full overflow-y-auto p-4'>
          <div className='flex flex-col justify-center align-middle'>
            <Playlists />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1 basis-full p-2 md:p-4'>
      <div className='rounded-custom no-scrollbar glass-pane container m-auto flex h-svh max-h-[calc(100vh-288px)] flex-1 basis-full flex-col overflow-y-auto p-4'>
        <button className='mr-2 self-start hover:text-gray-300' onClick={handleClearPlaylist}>
          <span className='mr-1'>
            <FontAwesomeIcon icon={faLeftLong} />
          </span>{' '}
          Return to playlist selection
        </button>
        {playlist && (
          <>
            <PlaylistHeader playlistData={playlistData} />
            <PlaylistBody playlistData={playlistData} />
          </>
        )}
      </div>
    </div>
  )
}

export default CenterContent
