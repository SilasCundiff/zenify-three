'use client'
import { useEffect, useState } from 'react'
import { useSpotifyApi } from '@/helpers/hooks/useSpotify'
import { useSession } from 'next-auth/react'
import { useSelectedPlaylistStore } from '@/helpers/hooks/usePlaylist'
import PlaylistBody from './PlaylistBody'
import PlaylistHeader from './PlaylistHeader'
import Playlists from './Playlists'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'

function CenterContent() {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()
  const [playlistData, setPlaylistData] = useState(null)
  const spotifyApi = useSpotifyApi()
  const { status } = useSession()

  const handleClearPlaylist = () => {
    setPlaylist(null)
    setPlaylistData(null)
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

  // if (status !== 'authenticated') {
  //   return (
  //     <div className='flex  w-full justify-center bg-amber-200 align-middle'>
  //       <div className=' m-auto   rounded-lg'>
  //         <div className='flex h-full flex-col justify-center align-middle'>
  //           <LoadingSpinner size='large' />
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

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
        <button className=' mr-2 hover:text-gray-300 md:ml-auto' onClick={handleClearPlaylist}>
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
