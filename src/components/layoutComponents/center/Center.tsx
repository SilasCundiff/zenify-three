'use client'
import { useEffect, useState } from 'react'
import { useSpotifyApi } from '@/helpers/hooks/useSpotify'
import { useSession } from 'next-auth/react'
import { useSelectedPlaylistStore } from '@/helpers/hooks/usePlaylist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PlaylistBody from './PlaylistBody'
import PlaylistHeader from './PlaylistHeader'

function CenterContent() {
  const { playlist } = useSelectedPlaylistStore()
  const [playlistData, setPlaylistData] = useState(null)
  const spotifyApi = useSpotifyApi()
  const { status } = useSession()

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
      <div className='bg-amber-200'>
        <div className=' rounded-lg bg-blue-500'>
          <div className='flex  flex-col justify-center  align-middle'>
            <h1 className='text-2xl font-semibold'>Select a playlist to view its contents</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex w-full justify-center  align-middle'>
      <div className='m-auto rounded-lg'>
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
