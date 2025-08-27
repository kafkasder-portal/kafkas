import { cva, cn } from '../design-system/utils';

/**
 * Breadcrumb Navigation Component
 * Shows the current page's location in the site hierarchy
 */
const breadcrumbVariants = cva('flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400');

const Breadcrumb = ({ className, ...props }) => (
  <nav
    aria-label="Breadcrumb"
    className={breadcrumbVariants({ className })}
    {...props}
  />
);

const BreadcrumbList = ({ className, ...props }) => (
  <ol
    className={cn('flex items-center gap-1.5 break-words text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
);

const BreadcrumbItem = ({ className, ...props }) => (
  <li
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
);

const BreadcrumbLink = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? 'span' : 'a';
  
  return (
    <Comp
      className={cn(
        'transition-colors hover:text-gray-900 dark:hover:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-sm',
        className
      )}
      {...props}
    />
  );
};

const BreadcrumbPage = ({ className, ...props }) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-medium text-gray-900 dark:text-gray-100', className)}
    {...props}
  />
);

const BreadcrumbSeparator = ({ children, className, ...props }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-gray-400 dark:text-gray-600', className)}
    {...props}
  >
    {children || (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )}
  </li>
);

/**
 * Simple Breadcrumb builder from path array
 */
const SimpleBreadcrumb = ({ 
  items = [], 
  separator = '/', 
  className,
  onItemClick 
}) => {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {item.label || item}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    onClick={(e) => {
                      if (onItemClick && item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      } else if (onItemClick) {
                        e.preventDefault();
                        onItemClick(item, index);
                      }
                    }}
                  >
                    {item.label || item}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLast && (
                <BreadcrumbSeparator>
                  {typeof separator === 'string' ? (
                    <span className="text-gray-400">{separator}</span>
                  ) : (
                    separator
                  )}
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  SimpleBreadcrumb,
};
