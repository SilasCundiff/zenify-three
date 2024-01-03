'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ListItem from './ListItem'
import { useSpotifyApi } from '@/helpers/hooks'

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

  return (
    <>
      <div className='overflow-y-auto overflow-x-hidden'>
        <ul className='flex max-h-full flex-wrap gap-4 p-3 text-lg font-normal'>
          {playlists &&
            playlists.map((playlist) => {
              return (
                <>
                  <ListItem
                    key={playlist.id}
                    playlistId={playlist.id}
                    playlistTitle={playlist.name}
                    playlistImageUrl={playlist?.images[0].url}
                  />
                </>
              )
            })}
        </ul>
      </div>
    </>
  )
}

export default Playlists
