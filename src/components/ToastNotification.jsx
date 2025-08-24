import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { TOAST_TYPES } from '../utils/toast';

/**
 * Reusable Toast Notification Component
 * Eliminates duplicate toast rendering code across components
 */
const ToastNotification = ({ toast }) => {
  const getBackgroundColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return '#10b981';
      case TOAST_TYPES.ERROR:
        return '#ef4444';
      case TOAST_TYPES.WARNING:
        return '#f59e0b';
      case TOAST_TYPES.INFO:
      default:
        return '#3b82f6';
    }
  };

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: getBackgroundColor(),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: 9999,
            minWidth: '250px',
            maxWidth: '400px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {toast.type === TOAST_TYPES.SUCCESS && <span>✓</span>}
            {toast.type === TOAST_TYPES.ERROR && <span>✕</span>}
            {toast.type === TOAST_TYPES.WARNING && <span>⚠</span>}
            {toast.type === TOAST_TYPES.INFO && <span>ℹ</span>}
            <span>{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
