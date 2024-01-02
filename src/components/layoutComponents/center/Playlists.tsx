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
    <div>
      <h2 className='mb-2 ml-2 text-2xl'>Your Playlists</h2>
      <div className='shrink grow overflow-y-auto overflow-x-hidden'>
        <ul className='flex max-h-[816px] min-h-min flex-wrap gap-4 p-3 text-lg font-normal'>
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
    </div>
  )
}

export default Playlists
