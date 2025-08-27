import React, { useState } from 'react';
import { cva } from '../design-system/utils';

// Tabs Root Container
const tabsVariants = cva('w-full', {
  variants: {
    orientation: {
      horizontal: 'flex flex-col',
      vertical: 'flex flex-row',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const Tabs = ({ 
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div 
      className={tabsVariants({ orientation, className })}
      data-orientation={orientation}
      {...props}
    >
      <TabsContext.Provider value={{
        value,
        onValueChange: handleValueChange,
        orientation,
      }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
};

// Context for sharing state between components
const TabsContext = React.createContext({});
const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Tabs List (Tab Navigation)
const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900 p-1',
  {
    variants: {
      orientation: {
        horizontal: 'h-9 w-full',
        vertical: 'flex-col h-auto w-48',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

const TabsList = ({ className, ...props }) => {
  const { orientation } = useTabsContext();
  
  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={tabsListVariants({ orientation, className })}
      {...props}
    />
  );
};

// Individual Tab Trigger
const tabsTriggerVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1',
    'text-sm font-medium ring-offset-background transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow',
    'dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50',
    'hover:bg-gray-200 dark:hover:bg-gray-800',
    'data-[state=active]:hover:bg-white dark:data-[state=active]:hover:bg-gray-950',
  ],
  {
    variants: {
      orientation: {
        horizontal: 'flex-1',
        vertical: 'w-full justify-start',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

const TabsTrigger = ({ value, className, children, disabled, ...props }) => {
  const { value: selectedValue, onValueChange, orientation } = useTabsContext();
  const isActive = value === selectedValue;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      data-state={isActive ? 'active' : 'inactive'}
      id={`tab-${value}`}
      className={tabsTriggerVariants({ orientation, className })}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

// Tab Content Panel
const tabsContentVariants = cva([
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-brand-500 focus-visible:ring-offset-2',
  'data-[state=inactive]:hidden',
]);

const TabsContent = ({ value, className, children, ...props }) => {
  const { value: selectedValue } = useTabsContext();
  const isActive = value === selectedValue;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      data-state={isActive ? 'active' : 'inactive'}
      className={tabsContentVariants({ className })}
      tabIndex={isActive ? 0 : -1}
      {...props}
    >
      {isActive && children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
