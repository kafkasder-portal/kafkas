
// Auth import removed
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  // Mock connection status - always online
  const connectionStatus = 'online';

  if (connectionStatus === 'online') {
    return null; // Don't show anything when online
  }

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'offline':
        return {
          icon: '🔴',
          message: 'Bağlantı sorunu tespit edildi',
          description: 'Lütfen internet bağlantınızı kontrol edin',
          className: 'connection-status offline',
        };
      case 'checking':
        return {
          icon: '🟡',
          message: 'Bağlantı kontrol ediliyor...',
          description: 'Lütfen bekleyin',
          className: 'connection-status checking',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) return null;

  return (
    <div className={statusInfo.className}>
      <div className='connection-status-content'>
        <span className='connection-status-icon'>{statusInfo.icon}</span>
        <div className='connection-status-text'>
          <div className='connection-status-message'>{statusInfo.message}</div>
          <div className='connection-status-description'>
            {statusInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
