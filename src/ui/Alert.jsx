import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cva, cn } from '../design-system/utils';
import { iconSize } from '../design-system/design-tokens';
import { IconButton } from './Button.jsx';

/**
 * Alert variant styles
 */
const alertVariants = cva({
  base: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  variants: {
    variant: {
      default: 'bg-background-primary text-foreground border-border',
      success: 'bg-success-50 text-success-900 border-success-200 [&>svg]:text-success-600',
      warning: 'bg-warning-50 text-warning-900 border-warning-200 [&>svg]:text-warning-600',
      danger: 'bg-danger-50 text-danger-900 border-danger-200 [&>svg]:text-danger-600',
      info: 'bg-accent-50 text-accent-900 border-accent-200 [&>svg]:text-accent-600',
    }
  },
  defaultVariants: {
    variant: 'default',
  }
});

/**
 * Get icon for alert variant
 */
const getAlertIcon = (variant) => {
  switch (variant) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'danger':
      return AlertCircle;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

/**
 * Alert Component
 * 
 * Display important messages and notifications to users.
 */
export const Alert = ({
  children,
  variant = 'default',
  title,
  dismissible = false,
  onDismiss,
  showIcon = true,
  className,
  ...props
}) => {
  const IconComponent = getAlertIcon(variant);
  
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (
        <IconComponent size={iconSize.md} />
      )}
      
      {dismissible && (
        <IconButton
          variant="ghost"
          size="sm"
          icon={<X size={iconSize.sm} />}
          onClick={onDismiss}
          className="absolute right-2 top-2 h-6 w-6"
          aria-label="Dismiss alert"
        />
      )}
      
      <div className={cn(dismissible && 'pr-8')}>
        {title && (
          <AlertTitle className="mb-1">
            {title}
          </AlertTitle>
        )}
        
        {children && (
          <AlertDescription>
            {children}
          </AlertDescription>
        )}
      </div>
    </div>
  );
};

/**
 * AlertTitle Component
 */
export const AlertTitle = ({ children, className, ...props }) => {
  return (
    <h5
      className={cn(
        'mb-1 font-medium leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h5>
  );
};

/**
 * AlertDescription Component
 */
export const AlertDescription = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Compound components
Alert.Title = AlertTitle;
Alert.Description = AlertDescription;

export default Alert;
