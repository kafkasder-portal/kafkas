import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../design-system/utils';
import { iconSize } from '../design-system/design-tokens';
import { Button, IconButton } from './Button';

/**
 * Modal Component
 * 
 * A flexible modal dialog with backdrop, close handling, and size variants.
 * Implements proper accessibility with focus management and ARIA attributes.
 */
export const Modal = ({
  children,
  isOpen = false,
  onClose,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  ...props
}) => {
  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      {...props}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-background-primary rounded-lg shadow-xl border border-border',
          'w-full max-h-[90vh] overflow-y-auto custom-scrollbar',
          {
            'max-w-sm': size === 'xs',
            'max-w-md': size === 'sm', 
            'max-w-lg': size === 'md',
            'max-w-2xl': size === 'lg',
            'max-w-4xl': size === 'xl',
            'max-w-6xl': size === '2xl',
          },
          className
        )}
      >
        {/* Close Button */}
        {showCloseButton && (
          <div className="absolute right-4 top-4 z-10">
            <IconButton
              variant="ghost"
              size="sm"
              icon={<X size={iconSize.sm} />}
              onClick={onClose}
              aria-label="Close modal"
            />
          </div>
        )}
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

/**
 * ModalHeader Component
 */
export const ModalHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * ModalTitle Component
 */
export const ModalTitle = ({ children, className, ...props }) => {
  return (
    <h2
      id="modal-title"
      className={cn(
        'text-lg font-semibold text-foreground pr-8',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

/**
 * ModalDescription Component
 */
export const ModalDescription = ({ children, className, ...props }) => {
  return (
    <p
      className={cn(
        'text-sm text-foreground-muted mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * ModalBody Component
 */
export const ModalBody = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * ModalFooter Component
 */
export const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-border',
        'flex items-center justify-end space-x-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Compound components
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
