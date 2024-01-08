import { useEffect, useState } from 'react'

// detect if mouse has moved within the last 5 seconds
export const useMouseMovement = () => {
  const [mouseMoved, setMouseMoved] = useState(false)
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseMoved(true)
      setTimeout(() => {
        setMouseMoved(false)
      }, 5000)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mouseMoved
}
