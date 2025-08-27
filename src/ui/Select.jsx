import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../design-system/utils';
import { iconSize } from '../design-system/design-tokens';

/**
 * Select Component
 * 
 * A custom select dropdown component with search functionality and keyboard navigation.
 * Supports single and multiple selection modes.
 */
export const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  size = 'md',
  disabled = false,
  error = false,
  searchable = false,
  multiple = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        }
        break;
    }
  };

  const handleOptionSelect = (option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some(v => v.value === option.value);
      
      if (isSelected) {
        onChange(currentValues.filter(v => v.value !== option.value));
      } else {
        onChange([...currentValues, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  const isOptionSelected = (option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      return currentValues.some(v => v.value === option.value);
    }
    return value?.value === option.value;
  };

  const getDisplayValue = () => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.length === 0) return placeholder;
      if (currentValues.length === 1) return currentValues[0].label;
      return `${currentValues.length} selected`;
    }
    return value?.label || placeholder;
  };

  return (
    <div 
      ref={selectRef}
      className={cn('relative', className)}
      {...props}
    >
      {/* Select Trigger */}
      <button
        type="button"
        className={cn(
          // Base styles
          'flex w-full items-center justify-between rounded-md border bg-background-primary px-3 py-2',
          'text-left text-sm transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          
          // Size variants
          {
            'h-8 px-2 text-xs': size === 'sm',
            'h-9 px-3 text-sm': size === 'md',
            'h-10 px-4 text-base': size === 'lg',
          },
          
          // State styles
          {
            'border-border hover:bg-muted-50': !error && !disabled,
            'border-danger-500 focus-visible:ring-danger-500': error,
            'cursor-not-allowed opacity-50': disabled,
            'text-foreground-muted': !value || (multiple && (!value || value.length === 0)),
            'text-foreground': value && (!multiple || value.length > 0),
          }
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="block truncate">
          {getDisplayValue()}
        </span>
        
        <ChevronDown 
          size={iconSize.sm}
          className={cn(
            'transition-transform duration-200',
            { 'rotate-180': isOpen }
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={cn(
          'absolute z-dropdown mt-1 w-full',
          'rounded-md border border-border bg-background-primary shadow-lg',
          'max-h-60 overflow-auto custom-scrollbar'
        )}>
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  'w-full px-2 py-1 text-sm border border-border rounded',
                  'focus:outline-none focus:ring-1 focus:ring-brand-500',
                  'bg-background-primary'
                )}
              />
            </div>
          )}

          {/* Options */}
          <div role="listbox" className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-foreground-muted">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = isOptionSelected(option);
                const isFocused = index === focusedIndex;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-sm',
                      'transition-colors duration-fast',
                      {
                        'bg-brand-50 text-brand-600': isSelected,
                        'bg-muted-50': isFocused && !isSelected,
                        'hover:bg-muted-50': !isSelected,
                        'text-foreground': !isSelected,
                      }
                    )}
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <span className="block truncate">
                      {option.label}
                    </span>
                    
                    {isSelected && (
                      <Check size={iconSize.sm} className="text-brand-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Simple native select for basic use cases
 */
export const NativeSelect = ({
  options = [],
  size = 'md',
  error = false,
  className,
  ...props
}) => {
  return (
    <select
      className={cn(
        // Base styles
        'flex w-full rounded-md border border-border bg-background-primary px-3 py-2',
        'text-sm transition-colors duration-fast appearance-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        
        // Size variants
        {
          'h-8 px-2 text-xs': size === 'sm',
          'h-9 px-3 text-sm': size === 'md',
          'h-10 px-4 text-base': size === 'lg',
        },
        
        // Error state
        {
          'border-danger-500 focus-visible:ring-danger-500': error,
        },
        
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
