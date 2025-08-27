import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva, cn } from '../design-system/utils';

/**
 * Dropdown Menu Component
 * Used for action menus, context menus, and navigation dropdowns
 */
const dropdownContentVariants = cva([
  'absolute z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800',
  'bg-white dark:bg-gray-900 p-1 text-gray-950 dark:text-gray-50',
  'shadow-md animate-in fade-in-0 zoom-in-95 duration-200',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
]);

const DropdownContext = React.createContext({});

const Dropdown = ({ children, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    
    let x = triggerRect.left;
    let y = triggerRect.bottom + 4;

    // Adjust if dropdown would go off screen
    if (x + contentRect.width > window.innerWidth) {
      x = triggerRect.right - contentRect.width;
    }
    
    if (y + contentRect.height > window.innerHeight) {
      y = triggerRect.top - contentRect.height - 4;
    }

    setPosition({ x, y });
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
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

  // Close on outside click
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (
          triggerRef.current && 
          contentRef.current &&
          !triggerRef.current.contains(event.target) &&
          !contentRef.current.contains(event.target)
        ) {
          handleOpenChange(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{
      isOpen,
      onOpenChange: handleOpenChange,
      triggerRef,
      contentRef,
      position,
    }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownTrigger = ({ children, asChild = false, ...props }) => {
  const { onOpenChange, isOpen, triggerRef } = React.useContext(DropdownContext);

  const handleClick = () => {
    onOpenChange(!isOpen);
  };

  if (asChild) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      'aria-expanded': isOpen,
      'aria-haspopup': 'menu',
      ...props,
    });
  }

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      {...props}
    >
      {children}
    </button>
  );
};

const DropdownContent = ({ className, align = 'start', side = 'bottom', ...props }) => {
  const { isOpen, contentRef, position } = React.useContext(DropdownContext);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={dropdownContentVariants({ className })}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      data-state={isOpen ? 'open' : 'closed'}
      data-side={side}
      data-align={align}
      role="menu"
      {...props}
    />,
    document.body
  );
};

const dropdownItemVariants = cva([
  'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5',
  'text-sm outline-none transition-colors',
  'hover:bg-gray-100 dark:hover:bg-gray-800',
  'focus:bg-gray-100 dark:focus:bg-gray-800',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
]);

const DropdownItem = ({ className, inset = false, disabled = false, onClick, ...props }) => {
  const { onOpenChange } = React.useContext(DropdownContext);

  const handleClick = (e) => {
    if (!disabled) {
      onClick?.(e);
      onOpenChange(false);
    }
  };

  return (
    <div
      className={cn(
        dropdownItemVariants({ className }),
        inset && 'pl-8'
      )}
      role="menuitem"
      data-disabled={disabled}
      onClick={handleClick}
      {...props}
    />
  );
};

const DropdownSeparator = ({ className, ...props }) => (
  <div
    className={cn('-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800', className)}
    role="separator"
    {...props}
  />
);

const DropdownLabel = ({ className, inset = false, ...props }) => (
  <div
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
