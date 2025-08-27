import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
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

AnimatedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AnimatedRoutes
