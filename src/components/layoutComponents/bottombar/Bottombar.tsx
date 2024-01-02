import Player from './Player'
import PlaybackInfoPane from './PlaybackInfoPane'

function Bottombar() {
  return (
    <div className='flex flex-col bg-transparent md:grid md:grid-cols-[300px_1fr_300px] md:p-4'>
      <PlaybackInfoPane />
      <Player />
    </div>
  )
}

export default Bottombar
