import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * @description High-performance image component with WebP support, lazy loading, and responsive images
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS class name
 * @param {Object} props.style - Inline styles
 * @param {string} props.sizes - Responsive image sizes
 * @param {boolean} props.lazy - Enable lazy loading
 * @param {string} props.placeholder - Placeholder image URL
 * @param {number} props.quality - Image quality (1-100)
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @returns {JSX.Element} Optimized image component
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  style = {},
  sizes = '(max-width: 768px) 100vw, 50vw',
  lazy = true,
  placeholder = '',
  quality = 85,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Generate WebP source
  const generateWebPSrc = (imageSrc) => {
    if (!imageSrc) return '';
    
    // If already WebP, return as is
    if (imageSrc.includes('.webp')) return imageSrc;
    
    // Convert to WebP
    const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  // Generate responsive srcSet
  const generateSrcSet = (imageSrc) => {
    if (!imageSrc) return '';
    
    const widths = [300, 600, 900, 1200, 1920];
    return widths
      .map(width => `${imageSrc}?w=${width}&q=${quality} ${width}w`)
      .join(', ');
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  // Generate optimized sources
  const webpSrc = generateWebPSrc(src);
  const srcSet = generateSrcSet(src);
  const webpSrcSet = generateSrcSet(webpSrc);

  // Fallback to original src if WebP fails
  const finalSrc = error && webpSrc !== src ? src : (isInView ? src : '');
  const finalWebpSrc = error ? '' : (isInView ? webpSrc : '');

  return (
    <div
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <div
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url(${placeholder}) center/cover`,
            filter: 'blur(10px)',
            opacity: 0.5,
          }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !placeholder && (
        <div
          className="image-skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s infinite',
          }}
        />
      )}

      {/* Optimized image */}
      <picture>
        {/* WebP source */}
        {finalWebpSrc && (
          <source
            srcSet={webpSrcSet}
            sizes={sizes}
            type="image/webp"
          />
        )}
        
        {/* Fallback image */}
        <img
          src={finalSrc}
          alt={alt}
          srcSet={srcSet}
          sizes={sizes}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            width: '100%',
            height: 'auto',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            ...style,
          }}
          {...props}
        />
      </picture>

      {/* Error fallback */}
      {error && (
        <div
          className="image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            color: '#666',
            fontSize: '14px',
          }}
        >
          <span>Image failed to load</span>
        </div>
      )}

      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .optimized-image {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        .optimized-image.loaded {
          opacity: 1;
        }
        
        .optimized-image.loading {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  sizes: PropTypes.string,
  lazy: PropTypes.bool,
  placeholder: PropTypes.string,
  quality: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default OptimizedImage;
