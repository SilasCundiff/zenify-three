import { useState } from 'react'
import { useSearchTracksStore } from '@/helpers/hooks/useSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInput() {
  const [search, setSearch] = useState('')
  const { setTracksResponseData } = useSearchTracksStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!search) return
    setTracksResponseData(search)
  }

  const handleInputEvent = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div className='rounded-custom relative w-full text-slate-900 md:mx-auto md:max-w-lg'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='rounded-custom relative bg-pink-50 font-semibold ring-2 ring-pink-50 ring-offset-0 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-300 focus-within:ring-offset-2'
      >
        <input
          className='rounded-custom w-full bg-transparent px-4 py-2 text-slate-900 focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0'
          type='text'
          name='search'
          id='search'
          value={search}
          placeholder='Search for a song'
          onChange={(e) => handleInputEvent(e)}
          maxLength={50}
        />
        <button
          type='submit'
          className='rounded-custom absolute right-[-2px] top-[50%] z-0 mr-0.5 flex translate-y-[-50%] items-center justify-center rounded-l-none   p-2 text-slate-900 hover:bg-pink-300 hover:text-white'
        >
          <FontAwesomeIcon className='h-6 w-6' icon={faSearch} />
        </button>
      </form>
    </div>
  )
}
