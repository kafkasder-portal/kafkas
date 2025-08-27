import React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, cn } from '../design-system/utils';

/**
 * Button variant styles using class-variance-authority pattern
 */
const buttonVariants = cva({
  base: `
    inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm
    transition-colors duration-fast ease-in-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:h-4 [&_svg]:w-4
  `,
  variants: {
    variant: {
      primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
      secondary: 'bg-muted-100 text-foreground hover:bg-muted-200 active:bg-muted-300',
      outline: 'border border-border bg-background-primary hover:bg-muted-50 active:bg-muted-100',
      ghost: 'text-foreground hover:bg-muted-100 active:bg-muted-200',
      link: 'text-brand-600 underline-offset-4 hover:underline',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800',
      success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
      icon: 'h-9 w-9',
    },
    fullWidth: {
      'true': 'w-full',
      'false': '',
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: 'false',
  },
});

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Follows the design system standards with consistent styling and accessibility.
 */
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props 
}, ref) => {
  const isDisabled = disabled || loading;
  const fullWidthStr = fullWidth ? 'true' : 'false';
  
  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, fullWidth: fullWidthStr }),
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin" size={16} />
      )}
      
      {!loading && leftIcon && (
        <span className="inline-flex items-center">
          {leftIcon}
        </span>
      )}
      
      {children && (
        <span>
          {children}
        </span>
      )}
      
      {!loading && rightIcon && (
        <span className="inline-flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * Icon Button - specialized button for icon-only usage
 */
export const IconButton = React.forwardRef(({ icon, className, size = 'icon', ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn('shrink-0', className)}
      size={size}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export default Button;
