import React from 'react';
import { cva, cn } from '../design-system/utils';

/**
 * Badge variant styles
 */
const badgeVariants = cva({
  base: 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors',
  variants: {
    variant: {
      default: 'bg-muted-100 text-foreground hover:bg-muted-200',
      primary: 'bg-brand-100 text-brand-800 hover:bg-brand-200',
      secondary: 'bg-muted-100 text-muted-700 hover:bg-muted-200',
      success: 'bg-success-100 text-success-800 hover:bg-success-200',
      warning: 'bg-warning-100 text-warning-800 hover:bg-warning-200',
      danger: 'bg-danger-100 text-danger-800 hover:bg-danger-200',
      outline: 'border border-border text-foreground hover:bg-muted-50',
    },
    size: {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-1 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  }
});

/**
 * Badge Component
 * 
 * Small status descriptors for UI elements.
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        badgeVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Status Badge - specialized badge for status indicators
 */
export const StatusBadge = ({ status, children, className, ...props }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
      case 'success':
      case 'completed':
      case 'approved':
        return 'success';
      case 'pending':
      case 'warning':
      case 'in-progress':
        return 'warning';
      case 'inactive':
      case 'error':
      case 'failed':
      case 'rejected':
        return 'danger';
      case 'draft':
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={className}
      {...props}
    >
      {children}
    </Badge>
  );
};

/**
 * Count Badge - badge with numeric count
 */
export const CountBadge = ({ count, max = 99, className, ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count <= 0) return null;
  
  return (
    <Badge
      variant="danger"
      size="sm"
      className={cn('min-w-[1.25rem] justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

export default Badge;
