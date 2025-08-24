import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './AnimatedRoutes.css'

const AnimatedRoutes = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fade-in')
  const animationRef = useRef()

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out')
    }
  }, [location, displayLocation])

  const handleAnimationEnd = (event) => {
    // Sadece ana container'ın animasyonunu dinle
    if (event.target === animationRef.current && transitionStage === 'fade-out') {
      setDisplayLocation(location)
      setTransitionStage('fade-in')
    }
  }

  return (
    <div 
      ref={animationRef}
      className={`animated-routes ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  )
}

export default AnimatedRoutes
