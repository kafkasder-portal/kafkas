import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VirtualList = memo(({
  items = [],
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  renderItem,
  className = '',
  onScroll,
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState(null)
  const scrollRef = useRef(null)

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1)

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(e)
  }, [onScroll])

  // Scroll to item
  const scrollToItem = useCallback((index) => {
    if (scrollRef.current) {
      const targetScrollTop = index * itemHeight
      scrollRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  }, [itemHeight])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: totalHeight,
        behavior: 'smooth'
      })
    }
  }, [totalHeight])

  // Expose scroll methods
  useEffect(() => {
    if (containerRef) {
      containerRef.scrollToItem = scrollToItem
      containerRef.scrollToTop = scrollToTop
      containerRef.scrollToBottom = scrollToBottom
    }
  }, [containerRef, scrollToItem, scrollToTop, scrollToBottom])

  return (
    <div
      ref={(ref) => {
        setContainerRef(ref)
        scrollRef.current = ref
      }}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`
          }}
        >
          <AnimatePresence>
            {visibleItems.map((item, index) => {
              const actualIndex = startIndex + index
              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: itemHeight }}
                >
                  {renderItem(item, actualIndex)}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
})

VirtualList.displayName = 'VirtualList'

export default VirtualList
