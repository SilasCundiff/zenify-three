import { useSelectedPlaylistStore } from '@/helpers/hooks'

const ListItem = ({ playlistId, playlistTitle }) => {
  const { setPlaylist, playlist } = useSelectedPlaylistStore()

  const handleSelectPlaylist = () => {
    if (playlistId === playlist?.id) return
    setPlaylist(playlistId)
  }

  return (
    <li
      className='w-full cursor-pointer whitespace-nowrap px-2 py-1.5 align-middle text-xl font-bold hover:text-green-300'
      onClick={handleSelectPlaylist}
    >
      {playlistTitle}
    </li>
  )
}

export default ListItem
