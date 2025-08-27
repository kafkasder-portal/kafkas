import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva } from '../design-system/utils';

const tooltipVariants = cva([
  'absolute z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
  'bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900',
  'animate-in fade-in-0 zoom-in-95 duration-200',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
  'data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2',
  'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
]);

/**
 * Tooltip component for helpful hints and information
 * Used throughout KAFKASDER for form field explanations, action descriptions, etc.
 */
const Tooltip = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 700,
  className,
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    const offset = 8; // Gap between trigger and tooltip

    let x = 0;
    let y = 0;

    // Calculate Y position based on side
    switch (side) {
      case 'top':
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Calculate X position based on side and alignment
    switch (side) {
      case 'top':
      case 'bottom':
        switch (align) {
          case 'start':
            x = triggerRect.left;
            break;
          case 'center':
            x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
            break;
          case 'end':
            x = triggerRect.right - tooltipRect.width;
            break;
        }
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        x = triggerRect.right + offset;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Calculate position after tooltip is rendered
      const timer = setTimeout(calculatePosition, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!content || disabled) {
    return children;
  }

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        'aria-describedby': isOpen ? 'tooltip' : undefined,
      })}
      
      {isOpen && createPortal(
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={tooltipVariants({ className })}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          data-side={side}
          data-align={align}
          data-state={isOpen ? 'open' : 'closed'}
          {...props}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export { Tooltip };
