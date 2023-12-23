import LoadingSpinner from '@/components/common/LoadingSpinner'
import Image from 'next/image'

export default function NowPlayingInfo({ songData }) {
  if (!songData || songData?.id === null) {
    return (
      <div className='flex max-w-[320px] items-center space-x-4 overflow-hidden'>
        <div className='p-4'></div>
      </div>
    )
  }

  return (
    <div className='flex max-w-[320px] items-center space-x-4 overflow-hidden'>
      {songData && (
        <>
          <Image
            className='hidden h-10 w-10 md:inline md:h-16 md:w-16'
            src={songData.album && songData?.album.images?.[0]?.url}
            alt='album cover'
            height={64}
            width={64}
          />
          <div>
            <h3 className='md:text-xl'>{songData?.name}</h3>
            <p className='md:text-lg'>{songData?.artists?.[0]?.name}</p>
          </div>
        </>
      )}
      {!songData && status === 'loading' && (
        <div className='p-4'>
          <LoadingSpinner size='small' />
        </div>
      )}
    </div>
  )
}
