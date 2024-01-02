import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  }

  return (
    <span className={`flex justify-center text-center font-bold text-green-100 ${sizeClasses[size]}`}>
      <span className='flex animate-spin items-center justify-center  transition-transform ease-in-out'>
        <FontAwesomeIcon icon={faSpinner} />
      </span>
    </span>
  )
}
