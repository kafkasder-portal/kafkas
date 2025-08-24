import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Info, Globe, Settings } from 'lucide-react';
import useDeviceDetection from '../hooks/useDeviceDetection.jsx';
import './DeviceInfo.css';

const DeviceInfo = memo(({ showDetailed = false }) => {
  const deviceInfo = useDeviceDetection();

  const getDeviceIcon = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return <Smartphone size={20} />;
      case 'tablet':
        return <Tablet size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  const getDeviceColor = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return '#10b981'; // green
      case 'tablet':
        return '#f59e0b'; // amber
      default:
        return '#3b82f6'; // blue
    }
  };

  if (!showDetailed) {
    return (
      <motion.div 
        className="device-indicator"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ color: getDeviceColor() }}
      >
        {getDeviceIcon()}
        <span className="device-type">{deviceInfo.type}</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="device-info-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="device-info-header">
        <div className="device-icon" style={{ color: getDeviceColor() }}>
          {getDeviceIcon()}
        </div>
        <div className="device-title">
          <h3>Cihaz Bilgileri</h3>
          <span className="device-type-badge" style={{ backgroundColor: getDeviceColor() }}>
            {deviceInfo.type.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="device-info-grid">
        <div className="info-item">
          <Monitor size={16} />
          <div>
            <span className="info-label">Ekran Boyutu</span>
            <span className="info-value">{deviceInfo.screenWidth} x {deviceInfo.screenHeight}</span>
          </div>
        </div>

        <div className="info-item">
          <Settings size={16} />
          <div>
            <span className="info-label">Yönelim</span>
            <span className="info-value">{deviceInfo.orientation === 'landscape' ? 'Yatay' : 'Dikey'}</span>
          </div>
        </div>

        <div className="info-item">
          <Globe size={16} />
          <div>
            <span className="info-label">Tarayıcı</span>
            <span className="info-value">{deviceInfo.browser}</span>
          </div>
        </div>

        <div className="info-item">
          <Info size={16} />
          <div>
            <span className="info-label">İşletim Sistemi</span>
            <span className="info-value">{deviceInfo.os}</span>
          </div>
        </div>

        <div className="info-item">
          <Smartphone size={16} />
          <div>
            <span className="info-label">Dokunmatik Destek</span>
            <span className="info-value">{deviceInfo.touchSupport ? 'Evet' : 'Hayır'}</span>
          </div>
        </div>

        <div className="info-item">
          <Settings size={16} />
          <div>
            <span className="info-label">Platform</span>
            <span className="info-value">{deviceInfo.platform}</span>
          </div>
        </div>
      </div>

      <div className="device-capabilities">
        <h4>Cihaz Özellikleri</h4>
        <div className="capabilities-grid">
          <div className={`capability ${deviceInfo.isMobile ? 'active' : ''}`}>
            <Smartphone size={14} />
            <span>Mobil</span>
          </div>
          <div className={`capability ${deviceInfo.isTablet ? 'active' : ''}`}>
            <Tablet size={14} />
            <span>Tablet</span>
          </div>
          <div className={`capability ${deviceInfo.isDesktop ? 'active' : ''}`}>
            <Monitor size={14} />
            <span>Desktop</span>
          </div>
          <div className={`capability ${deviceInfo.touchSupport ? 'active' : ''}`}>
            <Info size={14} />
            <span>Dokunmatik</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DeviceInfo;