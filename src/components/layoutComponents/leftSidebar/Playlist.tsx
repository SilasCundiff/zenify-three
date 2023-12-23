'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ListItem from './ListItem'
import { useSpotify } from '@/helpers/hooks'

function Playlist() {
  const spotifyApi = useSpotify()
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
    <div className='shrink grow overflow-y-auto overflow-x-hidden'>
      <ul className='min-h-min p-3 text-lg font-normal'>
        {playlists &&
          // @ts-ignore
          playlists.map((playlist) => {
            return <ListItem key={playlist.id} playlistId={playlist.id} playlistTitle={playlist.name} />
          })}
      </ul>
    </div>
  )
}

export default Playlist
