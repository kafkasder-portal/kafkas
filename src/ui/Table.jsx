import React from 'react';
import { cva, cn } from '../design-system/utils';

// Table Container
const tableVariants = cva(
  'w-full caption-bottom text-sm border-collapse border-spacing-0',
  {
    variants: {
      variant: {
        default: 'border border-gray-200 dark:border-gray-800',
        minimal: 'border-0',
        striped: 'border border-gray-200 dark:border-gray-800',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Table = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg">
      <table
        ref={ref}
        className={tableVariants({ variant, size, className })}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

// Table Header
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-gray-50 dark:bg-gray-900/50',
      '[&_tr]:border-b [&_tr]:border-gray-200 [&_tr]:dark:border-gray-800',
      className
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

// Table Body
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:border-0',
      '[&_tr]:border-b [&_tr]:border-gray-200 [&_tr]:dark:border-gray-800',
      '[&_tr:hover]:bg-gray-50 [&_tr:hover]:dark:bg-gray-900/30',
      className
    )}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

// Table Footer
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-gray-200 dark:border-gray-800',
      'bg-gray-50 dark:bg-gray-900/50',
      'font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

// Table Row
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-gray-200 dark:border-gray-800',
      'transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30',
      'data-[state=selected]:bg-brand-50 dark:data-[state=selected]:bg-brand-950/30',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

// Table Head Cell
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle font-semibold text-gray-900 dark:text-gray-50',
      'first:rounded-tl-lg last:rounded-tr-lg',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

// Table Cell
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle text-gray-700 dark:text-gray-300',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

// Table Caption
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4 text-sm text-gray-500 dark:text-gray-400',
      className
    )}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
