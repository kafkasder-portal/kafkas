import React from 'react';
import { cn } from '../design-system/utils';

/**
 * AppShell Layout Component
 * 
 * Main application shell that provides the basic layout structure:
 * - Sidebar navigation
 * - Header bar
 * - Main content area
 * 
 * Responsive design with collapsible sidebar on mobile devices.
 */
export const AppShell = ({ 
  children,
  className,
  sidebarCollapsed = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        // Base grid layout
        'min-h-screen bg-background-secondary',
        'grid grid-cols-1 grid-rows-[auto_1fr]',
        
        // Desktop layout with sidebar
        'lg:grid-cols-[280px_1fr]',
        
        // Collapsed sidebar variant
        {
          'lg:grid-cols-[64px_1fr]': sidebarCollapsed,
        },
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * AppShell Sidebar Component
 * 
 * Sidebar navigation area with responsive behavior.
 */
export const AppShellSidebar = ({
  children,
  className,
  collapsed = false,
  ...props
}) => {
  return (
    <aside
      className={cn(
        // Base styles
        'bg-background-primary border-r border-border',
        'overflow-hidden transition-all duration-300',
        
        // Mobile: hidden by default, can be shown via overlay
        'hidden lg:block',
        
        // Desktop: fixed width
        'lg:w-[280px]',
        
        // Collapsed state
        {
          'lg:w-[64px]': collapsed,
        },
        
        className
      )}
      {...props}
    >
      <div className="flex flex-col h-full custom-scrollbar overflow-y-auto">
        {children}
      </div>
    </aside>
  );
};

/**
 * AppShell Header Component
 * 
 * Top header bar that spans the full width.
 */
export const AppShellHeader = ({
  children,
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        // Layout
        'h-16 bg-background-primary border-b border-border',
        'flex items-center justify-between px-4 lg:px-6',
        'sticky top-0 z-40',
        
        // Grid positioning - spans full width
        'lg:col-span-2',
        
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
};

/**
 * AppShell Main Content Area
 * 
 * Main content container with proper spacing and responsive behavior.
 */
export const AppShellMain = ({
  children,
  className,
  maxWidth = '7xl',
  ...props
}) => {
  return (
    <main
      className={cn(
        // Layout and spacing
        'flex-1 overflow-auto',
        'p-4 lg:p-6',
        
        // Container with max width
        'w-full mx-auto',
        {
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-screen-2xl': maxWidth === '2xl',
          'max-w-[1600px]': maxWidth === '7xl',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};

/**
 * Page Component
 * 
 * Individual page wrapper with consistent spacing and typography.
 */
const Page = ({
  children,
  title,
  description,
  breadcrumb,
  actions,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'space-y-6',
        className
      )}
      {...props}
    >
      {/* Page Header */}
      {(title || breadcrumb || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {breadcrumb && (
              <nav className="text-sm text-foreground-muted">
                {breadcrumb}
              </nav>
            )}
            
            {title && (
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
            )}
            
            {description && (
              <p className="text-foreground-secondary max-w-2xl">
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
      )}
      
      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

/**
 * Compound components
 */
AppShell.Sidebar = AppShellSidebar;
AppShell.Header = AppShellHeader;
AppShell.Main = AppShellMain;

export { Page };
export default AppShell;
