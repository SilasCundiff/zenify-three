'use client'
import { useEffect, useState } from 'react'
import { useSpotify } from '@/helpers/hooks/useSpotify'
import { useSession } from 'next-auth/react'
import { useSelectedPlaylistStore } from '@/helpers/hooks/usePlaylist'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import PlaylistBody from './PlaylistBody'
import PlaylistHeader from './PlaylistHeader'

function CenterContent() {
  const { playlist } = useSelectedPlaylistStore()
  const [playlistData, setPlaylistData] = useState(null)
  const spotifyApi = useSpotify()
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

  if (status !== 'authenticated') {
    return (
      <div className='flex  h-[calc(100%-96px)] w-full justify-center align-middle'>
        <div className=' m-auto h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-lg'>
          <div className='flex h-full flex-col justify-center align-middle'>
            <LoadingSpinner size='large' />
          </div>
        </div>
      </div>
    )
  }

  if (!playlistData) {
    return (
      <div className='flex  h-[calc(100%-96px)] w-full justify-center align-middle'>
        <div className=' m-auto h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-lg'>
          <div className='flex h-full flex-col justify-center align-middle'>
            <h1 className='fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-2xl font-semibold'>
              Select a playlist to view its contents
            </h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-[calc(100%-96px)] w-full justify-center align-middle'>
      <div className='m-auto h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-lg'>
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
