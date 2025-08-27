import React from 'react';
import { cn } from '../design-system/utils';

/**
 * Card Component
 * 
 * A flexible card container with optional header, body, and footer sections.
 * Supports different variants for spacing and visual hierarchy.
 */
export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-background-primary shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader - Header section of the card
 */
export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardTitle - Title within the card header
 */
export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

/**
 * CardDescription - Description within the card header
 */
export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        'text-sm text-foreground-muted',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * CardContent - Main content area of the card
 */
export const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'p-6 pt-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardFooter - Footer section of the card
 */
export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center p-6 pt-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Compound card component with all sections as subcomponents
 */
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
