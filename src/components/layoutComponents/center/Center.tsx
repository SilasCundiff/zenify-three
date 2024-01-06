'use client'
import { useEffect, useRef, useState } from 'react'
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
import { useUI } from '@/helpers/hooks/useUI'

function CenterContent() {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()
  const [playlistData, setPlaylistData] = useState(null)
  const spotifyApi = useSpotifyApi()
  const { status } = useSession()
  const { tracksResponseData, setResetTracksResponseData } = useSearchTracksStore()
  const { uiHidden, hideCenterContentOnly } = useUI()

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
      <div
        className={`${
          uiHidden || hideCenterContentOnly ? 'pointer-events-none opacity-0' : 'opacity-100'
        } flex h-full flex-1 p-2 transition-opacity duration-500 md:p-4`}
      >
        <div className='content-wrapper__inner rounded-custom no-scrollbar glass-pane container m-auto flex flex-col overflow-y-auto p-4 md:max-h-[calc(100svh-232px)]'>
          <button className='mb-4 ml-0 mr-2 self-start hover:text-gray-300' onClick={handleClearSearchResults}>
            <span className='ml-2 mr-1'>
              <FontAwesomeIcon icon={faXmark} />
            </span>{' '}
            Clear search results
          </button>
          <div className='flex max-h-[calc(100svh-352px)] flex-1 flex-col overflow-y-auto  md:max-h-[calc(100svh-272px)]'>
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
      <div
        className={`${
          uiHidden || hideCenterContentOnly ? 'pointer-events-none opacity-0' : 'opacity-100'
        } flex h-full flex-1 p-2 transition-opacity duration-500 md:p-4`}
      >
        <div className='rounded-custom no-scrollbar glass-pane content-wrapper__inner container m-auto h-full p-4'>
          <h2 className='mb-2 ml-2 text-2xl'>Your Playlists</h2>
          <div className='max-h-[calc(100svh-354px)] overflow-y-auto  md:max-h-[calc(100svh-304px)]'>
            <Playlists />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        uiHidden || hideCenterContentOnly ? 'pointer-events-none opacity-0' : 'opacity-100'
      } flex h-full flex-1 p-2 transition-opacity duration-500 md:p-4`}
    >
      <div className='rounded-custom no-scrollbar glass-pane content-wrapper__inner container m-auto flex h-full max-h-[calc(100svh-280px)] flex-col overflow-y-auto  p-4 md:max-h-[calc(100svh-232px)] '>
        <button className='mb-4 mr-2  self-start hover:text-gray-300' onClick={handleClearPlaylist}>
          <span className='ml-2 mr-1'>
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
