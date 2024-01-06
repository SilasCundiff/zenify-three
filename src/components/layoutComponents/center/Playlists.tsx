'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ListItem from './ListItem'
import { useSpotifyApi } from '@/helpers/hooks'
import LoadingSpinner from '@/components/common/LoadingSpinner'

function Playlists() {
  const spotifyApi = useSpotifyApi()
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState(null)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [session, spotifyApi])

  // wait for all the playlists to be loaded before rendering
  if (!playlists) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='flex items-center justify-center space-x-2'>
          <LoadingSpinner />
          <p className='text-lg font-bold'>Loading Playlists...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='overflow-y-auto overflow-x-hidden'>
        <ul className='flex max-h-full min-h-full flex-wrap gap-4 p-3 text-lg font-normal'>
          {playlists &&
            playlists.map((playlist, i) => {
              return (
                <ListItem
                  key={playlist.id}
                  playlistId={playlist.id}
                  playlistTitle={playlist.name}
                  playlistImageUrl={playlist?.images[0].url}
                  order={i}
                />
              )
            })}
        </ul>
      </div>
    </>
  )
}

export default Playlists
