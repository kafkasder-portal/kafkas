import { useState, useEffect, memo } from 'react'
import {  AnimatePresence } from 'framer-motion'
import { Image, Loader, AlertCircle } from 'lucide-react'

const OptimizedImage = memo(({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
  lazy = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  format = 'webp',
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState('loading') // loading, loaded, error
  const [isInView, setIsInView] = useState(!lazy)
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Generate optimized image URL
  const generateOptimizedUrl = (originalSrc, targetWidth, targetHeight, targetQuality, targetFormat) => {
    if (!originalSrc || originalSrc.startsWith('data:')) {
      return originalSrc
    }

    // For external images, you might want to use an image optimization service
    // This is a placeholder implementation
    const url = new URL(originalSrc, window.location.origin)
    url.searchParams.set('w', targetWidth)
    url.searchParams.set('h', targetHeight)
    url.searchParams.set('q', targetQuality)
    url.searchParams.set('f', targetFormat)
    
    return url.toString()
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazy, priority])

  // Load image when in view
  useEffect(() => {
    if (!isInView) return

    const optimizedSrc = generateOptimizedUrl(src, width, height, quality, format)
    setCurrentSrc(optimizedSrc)
    setImageState('loading')
  }, [isInView, src, width, height, quality, format])

  // Handle image load
  const handleLoad = () => {
    setImageState('loaded')
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setImageState('error')
    onError?.()
  }

  // Preload image for priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [priority, src])

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {imageState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            <div className="flex flex-col items-center space-y-2">
              <Loader className="h-6 w-6 animate-spin text-gray-400" />
              <span className="text-xs text-gray-500">Yükleniyor...</span>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {imageState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            <div className="flex flex-col items-center space-y-2">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <span className="text-xs text-gray-500">Resim yüklenemedi</span>
            </div>
          </motion.div>
        )}

        {/* Image */}
        {isInView && (
          <motion.img
            key="image"
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
            {...props}
          />
        )}
      </AnimatePresence>

      {/* Placeholder */}
      {!isInView && (
        <img
          src={placeholder}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
