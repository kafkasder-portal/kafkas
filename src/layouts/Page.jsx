import { cn } from '../design-system/utils';

/**
 * Page Component
 * Provides consistent page structure with title, description, breadcrumbs, and actions
 */
const Page = ({
  title,
  description,
  breadcrumb,
  actions,
  children,
  className,
  maxWidth = '7xl',
  ...props
}) => {
  return (
    <div className={cn('p-6 space-y-6', className)} {...props}>
      {/* Page Header */}
      {(title || description || breadcrumb || actions) && (
        <div className="space-y-4">
          {breadcrumb && (
            <div className="text-sm">
              {breadcrumb}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className={cn(
        'w-full mx-auto space-y-6',
        maxWidth && `max-w-${maxWidth}`
      )}>
        {children}
      </div>
    </div>
  );
};

export { Page };