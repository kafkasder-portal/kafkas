import { cva, cn } from '../design-system/utils';

/**
 * Loading Spinner Component
 */
const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const Loading = ({ size = 'default', className, ...props }) => {
  return (
    <div
      className={spinnerVariants({ size, className })}
      role="status"
      aria-label="Yükleniyor..."
      {...props}
    />
  );
};

/**
 * Skeleton Component for loading placeholders
 */
const skeletonVariants = cva(
  'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
  {
    variants: {
      variant: {
        default: '',
        circle: 'rounded-full',
        text: 'h-4',
        heading: 'h-6',
        button: 'h-10',
        card: 'h-32',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Skeleton = ({ variant = 'default', className, ...props }) => {
  return (
    <div
      className={skeletonVariants({ variant, className })}
      {...props}
    />
  );
};

/**
 * Skeleton patterns for common use cases
 */
const SkeletonText = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
};

const SkeletonCard = ({ className }) => {
  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="heading" className="w-1/2" />
          <Skeleton variant="text" className="w-3/4" />
        </div>
      </div>
      <Skeleton variant="card" />
      <div className="flex space-x-2">
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="w-20" />
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Table Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={`header-${i}`} variant="text" className="flex-1" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Loading States for entire sections
 */
const LoadingState = ({ 
  type = 'spinner',
  text = 'Yükleniyor...',
  className 
}) => {
  const content = {
    spinner: <Loading size="lg" />,
    text: <SkeletonText />,
    card: <SkeletonCard />,
    table: <SkeletonTable />,
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 text-center',
      className
    )}>
      {content[type]}
      {type === 'spinner' && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};

export { 
  Loading, 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonTable,
  LoadingState 
};
