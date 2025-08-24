import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sayfa geçişlerinde animasyon durumunu yönetir
 * @returns {object} animasyon durumu ve yardımcı fonksiyonlar
 */
const usePageAnimation = () => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Sayfa değiştiğinde animasyonu sıfırla
    setIsVisible(false)
    
    // Kısa bir gecikme ile fade-in başlat
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [location.pathname])

  const pageClasses = `page-wrapper ${isVisible ? 'animate-fade-in-up' : ''}`
  
  const cardClasses = (index = 0) => 
    `card-animate card-smooth stagger-${Math.min(index + 1, 6)}`

  const buttonClasses = 'btn-smooth'

  return {
    pageClasses,
    cardClasses,
    buttonClasses,
    isVisible
  }
}

export default usePageAnimation
