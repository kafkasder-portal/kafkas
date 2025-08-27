/**
 * Utility functions for className management and design system
 * This provides similar functionality to clsx and tailwind-merge
 */

/**
 * Simple class name concatenation utility (similar to clsx)
 */
export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const result: string[] = [];
  
  for (const cls of classes) {
    if (!cls) continue;
    
    if (typeof cls === 'string') {
      result.push(cls);
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key);
      }
    }
  }
  
  return result.join(' ');
}

/**
 * Simple variant utility (basic version of class-variance-authority)
 */
type VariantConfig<V extends Record<string, Record<string, string>>> = {
  base?: string;
  variants: V;
  defaultVariants?: {
    [K in keyof V]?: keyof V[K];
  };
};

export function cva<V extends Record<string, Record<string, string>>>(
  config: VariantConfig<V>
) {
  return (props?: { [K in keyof V]?: keyof V[K] } & { className?: string }) => {
    const { className, ...variantProps } = props || {};
    
    let result = config.base || '';
    
    // Apply default variants first
    if (config.defaultVariants) {
      for (const [variantName, defaultValue] of Object.entries(config.defaultVariants)) {
        const variantClasses = config.variants[variantName as keyof V];
        if (variantClasses && defaultValue && typeof defaultValue === 'string') {
          const classes = variantClasses[defaultValue];
          if (classes) result += ' ' + classes;
        }
      }
    }
    
    // Apply provided variants (overriding defaults)
    for (const [variantName, variantValue] of Object.entries(variantProps)) {
      const variantClasses = config.variants[variantName as keyof V];
      if (variantClasses && variantValue && typeof variantValue === 'string') {
        const classes = variantClasses[variantValue];
        if (classes) {
          // Remove default variant classes and add new ones
          result = result.replace(
            new RegExp(`\\b${Object.values(variantClasses).join('\\b|\\b')}\\b`, 'g'),
            ''
          );
          result += ' ' + classes;
        }
      }
    }
    
    // Add custom className
    if (className) {
      result += ' ' + className;
    }
    
    return result.trim().replace(/\s+/g, ' ');
  };
}

/**
 * Focus ring utility
 */
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

/**
 * Common transition utilities
 */
export const transitions = {
  all: 'transition-all duration-normal ease-in-out',
  colors: 'transition-colors duration-fast ease-in-out',
  transform: 'transition-transform duration-normal ease-in-out',
  opacity: 'transition-opacity duration-fast ease-in-out',
};

/**
 * Common shadow utilities
 */
export const shadows = {
  sm: 'shadow-sm',
  default: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
};

/**
 * Screen reader only utility
 */
export const srOnly = 'sr-only';

/**
 * Container utilities
 */
export const container = {
  base: 'w-full mx-auto px-4 md:px-6',
  sizes: {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
  }
};

/**
 * Grid utilities for responsive layouts
 */
export const grid = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
  gap: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }
};

/**
 * Typography utilities
 */
export const typography = {
  heading: {
    h1: 'text-3xl md:text-4xl lg:text-5xl font-bold text-foreground',
    h2: 'text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground',
    h3: 'text-xl md:text-2xl lg:text-3xl font-semibold text-foreground',
    h4: 'text-lg md:text-xl font-medium text-foreground',
    h5: 'text-base md:text-lg font-medium text-foreground',
    h6: 'text-sm md:text-base font-medium text-foreground',
  },
  body: {
    large: 'text-lg text-foreground',
    default: 'text-base text-foreground',
    small: 'text-sm text-foreground-secondary',
    muted: 'text-sm text-foreground-muted',
  }
};

export default {
  cn,
  cva,
  focusRing,
  transitions,
  shadows,
  srOnly,
  container,
  grid,
  typography,
};
