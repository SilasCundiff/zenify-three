import { useSpotifyApi } from '@/helpers/hooks'
import { useEffect, useState } from 'react'
import { useSearchTracksStore } from '@/helpers/hooks/useSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInput() {
  const [search, setSearch] = useState('')
  const { setTracksResponseData } = useSearchTracksStore()

  const handleSubmit = (e) => {
    e.preventDefault()

    setTracksResponseData(search)
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className='rounded-custom relative w-full bg-red-500 text-black md:mx-auto md:max-w-lg'
    >
      <input
        className='rounded-custom w-full bg-slate-50 px-4 py-2 font-semibold text-black'
        type='text'
        name='search'
        id='search'
        value={search}
        placeholder='Search for a song'
        onChange={(e) => setSearch(e.target.value)}
        maxLength={50}
      />
      <button
        type='submit'
        className='rounded-custom z-1 absolute right-[-2px] top-[50%] flex translate-y-[-50%] items-center justify-center rounded-l-none bg-gray-700 p-2 text-white hover:bg-gray-600 hover:text-gray-100'
      >
        <FontAwesomeIcon className='h-6 w-6' icon={faSearch} />
      </button>
    </form>
  )
}
