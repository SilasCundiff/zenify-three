import NavMenu from './NavMenu'
import Playlist from '../center/Playlists'

function LeftSidebar() {
  return (
    <div className='flex min-h-full w-80 flex-col bg-blue-400 pb-8 pl-2'>
      <NavMenu />
      <hr className='mb-6 ml-5 mr-auto mt-3 w-64 opacity-50' />
      <Playlist />
    </div>
  )
}

export default LeftSidebar
