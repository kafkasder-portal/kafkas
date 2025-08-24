import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createNotificationService } from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

// Bildirim türleri
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// Bildirim öncelikleri
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enableSound: true,
    enableDesktop: true,
    enableEmail: false,
    enableSMS: false,
    autoRead: true,
    readTimeout: 5000,
  });
  // const [notificationService, setNotificationService] = useState(null);

  // Toast bildirimi göster
  const showToast = useCallback(
    (message, type = NOTIFICATION_TYPES.INFO, options = {}) => {
      const toastOptions = {
        duration: options.duration || 4000,
        position: options.position || 'top-right',
        style: {
          borderRadius: '10px',
          background: getToastBackground(type),
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          ...options.style,
        },
        ...options,
      };

      switch (type) {
        case NOTIFICATION_TYPES.SUCCESS:
          return toast.success(message, toastOptions);
        case NOTIFICATION_TYPES.ERROR:
          return toast.error(message, toastOptions);
        case NOTIFICATION_TYPES.WARNING:
          return toast(message, { ...toastOptions, icon: '⚠️' });
        case NOTIFICATION_TYPES.LOADING:
          return toast.loading(message, toastOptions);
        default:
          return toast(message, toastOptions);
      }
    },
    []
  );

  // Sistem bildirimi ekle
  const addNotification = useCallback(
    notification => {
      const newNotification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        read: false,
        priority: NOTIFICATION_PRIORITY.MEDIUM,
        ...notification,
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Toast göster
      if (notification.showToast !== false) {
        showToast(
          notification.message,
          notification.type,
          notification.toastOptions
        );
      }

      // Ses çal (eğer etkinse)
      if (
        settings.enableSound &&
        notification.priority !== NOTIFICATION_PRIORITY.LOW
      ) {
        playNotificationSound(notification.type);
      }

      // Desktop bildirim (eğer etkinse ve izin varsa)
      if (settings.enableDesktop && Notification.permission === 'granted') {
        showDesktopNotification(notification);
      }

      // Otomatik okundu olarak işaretle
      if (
        settings.autoRead &&
        notification.priority === NOTIFICATION_PRIORITY.LOW
      ) {
        setTimeout(() => {
          markAsRead(newNotification.id);
        }, settings.readTimeout);
      }

      return newNotification.id;
    },
    [settings, showToast]
  );

  // Bildirimi okundu olarak işaretle
  const markAsRead = useCallback(notificationId => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Bildirimi sil
  const removeNotification = useCallback(notificationId => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Tüm bildirimleri temizle
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter(n => !n.read).length;

  // Desktop bildirim izni iste
  const requestDesktopPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Ayarları güncelle
  const updateSettings = useCallback(newSettings => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Hızlı bildirim fonksiyonları
  const success = useCallback(
    (message, options) =>
      showToast(message, NOTIFICATION_TYPES.SUCCESS, options),
    [showToast]
  );

  const error = useCallback(
    (message, options) => showToast(message, NOTIFICATION_TYPES.ERROR, options),
    [showToast]
  );

  const warning = useCallback(
    (message, options) =>
      showToast(message, NOTIFICATION_TYPES.WARNING, options),
    [showToast]
  );

  const info = useCallback(
    (message, options) => showToast(message, NOTIFICATION_TYPES.INFO, options),
    [showToast]
  );

  const loading = useCallback(
    (message, options) =>
      showToast(message, NOTIFICATION_TYPES.LOADING, options),
    [showToast]
  );

  // Sistem bildirimleri
  const notifyTaskDeadline = useCallback(
    task => {
      addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        title: 'Görev Deadline Uyarısı',
        message: `"${task.title}" görevi yakında teslim tarihi ge��ecek!`,
        priority: NOTIFICATION_PRIORITY.HIGH,
        category: 'task_deadline',
        data: { taskId: task.id, deadline: task.deadline },
      });
    },
    [addNotification]
  );

  const notifyNewDonation = useCallback(
    donation => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title: 'Yeni Bağ��ş Alındı',
        message: `${donation.donor} tarafından ${donation.amount} bağış alındı`,
        priority: NOTIFICATION_PRIORITY.MEDIUM,
        category: 'donation',
        data: { donationId: donation.id },
      });
    },
    [addNotification]
  );

  const notifySystemUpdate = useCallback(
    update => {
      addNotification({
        type: NOTIFICATION_TYPES.INFO,
        title: 'Sistem Güncellemesi',
        message: update.message,
        priority: NOTIFICATION_PRIORITY.LOW,
        category: 'system',
        showToast: false,
      });
    },
    [addNotification]
  );

  const notifyUserActivity = useCallback(
    activity => {
      addNotification({
        type: NOTIFICATION_TYPES.INFO,
        title: 'Kullanıcı Aktivitesi',
        message: activity.message,
        priority: NOTIFICATION_PRIORITY.LOW,
        category: 'user_activity',
        showToast: false,
      });
    },
    [addNotification]
  );

  const value = {
    // State
    notifications,
    unreadCount,
    settings,

    // Toast functions
    showToast,
    success,
    error,
    warning,
    info,
    loading,

    // Notification management
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,

    // Settings
    updateSettings,
    requestDesktopPermission,

    // System notifications
    notifyTaskDeadline,
    notifyNewDonation,
    notifySystemUpdate,
    notifyUserActivity,

    // Constants
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITY,
  };

  // Notification service'i başlat
  useEffect(() => {
    const service = createNotificationService({
      showToast,
      addNotification,
      notifyTaskDeadline,
      notifyNewDonation,
      notifySystemUpdate,
      notifyUserActivity,
      NOTIFICATION_TYPES,
      NOTIFICATION_PRIORITY,
    });

    setNotificationService(service);

    // Real-time polling'i başlat
    service.startPolling();

    // Component unmount olduğunda polling'i durdur
    return () => {
      service.stopPolling();
    };
  }, [addNotification, notifyNewDonation, notifySystemUpdate, notifyTaskDeadline, notifyUserActivity, showToast]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position='top-center'
        gutter={8}
        containerStyle={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
          maxWidth: '420px',
          width: 'auto',
        }}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            pointerEvents: 'auto',
            maxWidth: '400px',
          },
        }}
      />
    </NotificationContext.Provider>
  );
};

// Yardımcı fonksiyonlar
const getToastBackground = type => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '#10b981';
    case NOTIFICATION_TYPES.ERROR:
      return '#ef4444';
    case NOTIFICATION_TYPES.WARNING:
      return '#f59e0b';
    case NOTIFICATION_TYPES.LOADING:
      return '#3b82f6';
    default:
      return '#6b7280';
  }
};

const playNotificationSound = type => {
  // Basit beep sesi (gerçek uygulamada ses dosyaları kullanılabilir)
  if ('AudioContext' in window) {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bildirim türüne göre ses frekansı
      const frequency = type === NOTIFICATION_TYPES.ERROR ? 400 : 800;
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // ignore
    }
  }
};

const showDesktopNotification = notification => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title || 'Bildirim', {
      body: notification.message,
    });
  }
};
