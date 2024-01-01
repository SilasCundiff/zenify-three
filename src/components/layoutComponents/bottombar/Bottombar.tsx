import Player from './Player'
import PlaybackInfoPane from './PlaybackInfoPane'

function Bottombar() {
  return (
    <div className='flex flex-col md:grid md:grid-cols-3 md:p-4'>
      <PlaybackInfoPane />
      <Player />
    </div>
  )
}

export default Bottombar
