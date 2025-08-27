import React from 'react';
import { cva, cn } from '../design-system/utils';

/**
 * Checkbox Component
 */
const checkboxVariants = cva([
  'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 dark:border-gray-700',
  'shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  'data-[state=checked]:bg-brand-600 data-[state=checked]:text-white',
  'data-[state=checked]:border-brand-600 dark:data-[state=checked]:bg-brand-500',
  'data-[state=checked]:dark:border-brand-500',
]);

const Checkbox = React.forwardRef(({
  className,
  checked,
  onCheckedChange,
  disabled,
  id,
  ...props
}, ref) => {
  const handleChange = (e) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={checkboxVariants({ className })}
        data-state={checked ? 'checked' : 'unchecked'}
        {...props}
      />
      {checked && (
        <svg
          className="absolute inset-0 h-4 w-4 text-current pointer-events-none"
          fill="currentColor"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
        </svg>
      )}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

/**
 * Switch Component (Toggle)
 */
const switchVariants = cva([
  'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
  'border-2 border-transparent shadow-sm transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  'data-[state=checked]:bg-brand-600 data-[state=unchecked]:bg-gray-200',
  'dark:data-[state=checked]:bg-brand-500 dark:data-[state=unchecked]:bg-gray-700',
]);

const switchThumbVariants = cva([
  'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg',
  'ring-0 transition-transform data-[state=checked]:translate-x-4',
  'data-[state=unchecked]:translate-x-0',
]);

const Switch = React.forwardRef(({
  className,
  checked,
  onCheckedChange,
  disabled,
  id,
  ...props
}, ref) => {
  const handleClick = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={switchVariants({ className })}
      data-state={checked ? 'checked' : 'unchecked'}
      {...props}
    >
      <span
        className={switchThumbVariants()}
        data-state={checked ? 'checked' : 'unchecked'}
      />
    </button>
  );
});
Switch.displayName = 'Switch';

/**
 * Checkbox with Label
 */
const CheckboxField = ({
  id,
  label,
  description,
  error,
  required,
  className,
  ...checkboxProps
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={checkboxId}
          {...checkboxProps}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error && 'text-red-600 dark:text-red-400'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Switch with Label
 */
const SwitchField = ({
  id,
  label,
  description,
  error,
  className,
  ...switchProps
}) => {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between space-x-3">
        <div className="grid gap-1.5 leading-none flex-1">
          <label
            htmlFor={switchId}
            className={cn(
              'text-sm font-medium leading-none cursor-pointer',
              error && 'text-red-600 dark:text-red-400',
              switchProps.disabled && 'cursor-not-allowed opacity-70'
            )}
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        <Switch
          id={switchId}
          {...switchProps}
        />
      </div>
    </div>
  );
};

export { Checkbox, Switch, CheckboxField, SwitchField };
