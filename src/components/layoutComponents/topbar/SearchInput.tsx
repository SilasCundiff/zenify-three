import { useSpotifyApi } from '@/helpers/hooks'
import { useEffect, useState } from 'react'
import { useSearchTracksStore } from '@/helpers/hooks/useSearch'

export default function SearchInput() {
  const [search, setSearch] = useState('')
  const spotifyApi = useSpotifyApi()
  const { tracksResponseData, setTracksResponseData } = useSearchTracksStore()

  const handleSubmit = (e) => {
    e.preventDefault()

    setTracksResponseData(search, 1)
  }

  useEffect(() => {
    console.log('res', tracksResponseData)
  }, [tracksResponseData])

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='rounded-custom w-full text-black md:mx-auto md:max-w-lg'>
      <input
        className='rounded-custom w-full bg-slate-50 px-4 py-2 font-semibold text-black'
        type='text'
        name='search'
        id='search'
        value={search}
        placeholder='Search for a song'
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  )
}
