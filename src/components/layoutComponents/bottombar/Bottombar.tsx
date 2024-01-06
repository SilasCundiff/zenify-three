import Player from './Player'
import PlaybackInfoPane from './PlaybackInfoPane'

function Bottombar() {
  return (
    <div className='pointer-events-auto flex w-full flex-col md:grid md:grid-cols-[300px_1fr_300px] md:p-4'>
      <PlaybackInfoPane />
      <Player />
    </div>
  )
}

export default Bottombar
