import React from 'react';
import { cn } from '../design-system/utils';

/**
 * Input Component
 * 
 * A versatile input field component with consistent styling and accessibility features.
 * Supports different sizes and states including error handling.
 */
export const Input = React.forwardRef(({
  className,
  type = 'text',
  size = 'md',
  error = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base styles
        'flex w-full rounded-md border border-border bg-background-primary px-3 py-2',
        'text-sm placeholder:text-foreground-muted',
        'transition-colors duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        
        // Size variants
        {
          'h-8 px-2 text-xs': size === 'sm',
          'h-9 px-3 text-sm': size === 'md',
          'h-10 px-4 text-base': size === 'lg',
        },
        
        // Error state
        {
          'border-danger-500 focus-visible:ring-danger-500': error,
          'border-border': !error,
        },
        
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

/**
 * Label Component
 * 
 * Accessible label component that pairs with form inputs.
 */
export const Label = ({ className, required = false, children, ...props }) => {
  return (
    <label
      className={cn(
        'text-sm font-medium text-foreground leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-danger-500" aria-label="required">
          *
        </span>
      )}
    </label>
  );
};

/**
 * FormField Component
 * 
 * Wrapper component that provides proper spacing and structure for form fields.
 */
export const FormField = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col space-y-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * HelperText Component
 * 
 * Helper or error text that appears below form inputs.
 */
export const HelperText = ({ 
  className, 
  error = false, 
  children, 
  ...props 
}) => {
  if (!children) return null;
  
  return (
    <p
      className={cn(
        'text-xs',
        {
          'text-danger-600': error,
          'text-foreground-muted': !error,
        },
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * Textarea Component
 * 
 * Multi-line text input component with consistent styling.
 */
export const Textarea = React.forwardRef(({
  className,
  error = false,
  disabled = false,
  rows = 3,
  ...props
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        // Base styles
        'flex min-h-[80px] w-full rounded-md border border-border bg-background-primary px-3 py-2',
        'text-sm placeholder:text-foreground-muted',
        'transition-colors duration-fast resize-vertical',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        
        // Error state
        {
          'border-danger-500 focus-visible:ring-danger-500': error,
          'border-border': !error,
        },
        
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Input;
