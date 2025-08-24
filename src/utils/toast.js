import { useCallback, useState } from 'react';

/**
 * Toast notification utility functions
 * Eliminates duplicate toast management logic across components
 */

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const TOAST_DURATION = 3000;

/**
 * Creates initial toast state
 */
export const createToastState = () => ({
  show: false,
  message: '',
  type: '',
});

/**
 * Shows a toast notification and returns the updated state
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 * @returns {Object} Updated toast state
 */
export const showToast = (message, type = TOAST_TYPES.INFO) => ({
  show: true,
  message,
  type,
});

/**
 * Hides the toast notification
 * @returns {Object} Hidden toast state
 */
export const hideToast = () => ({
  show: false,
  message: '',
  type: '',
});

/**
 * Custom hook for toast management
 */
export const useToast = () => {
  const [toast, setToast] = useState(createToastState());

  const showToastMessage = useCallback((message, type = TOAST_TYPES.INFO) => {
    setToast(showToast(message, type));
    setTimeout(() => setToast(hideToast()), TOAST_DURATION);
  }, []);

  const success = useCallback(
    message => {
      showToastMessage(message, TOAST_TYPES.SUCCESS);
    },
    [showToastMessage]
  );

  const error = useCallback(
    message => {
      showToastMessage(message, TOAST_TYPES.ERROR);
    },
    [showToastMessage]
  );

  const warning = useCallback(
    message => {
      showToastMessage(message, TOAST_TYPES.WARNING);
    },
    [showToastMessage]
  );

  const info = useCallback(
    message => {
      showToastMessage(message, TOAST_TYPES.INFO);
    },
    [showToastMessage]
  );

  return {
    toast,
    showToast: showToastMessage,
    success,
    error,
    warning,
    info,
  };
};
