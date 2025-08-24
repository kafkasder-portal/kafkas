import { useState, useEffect } from 'react'
import {  AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  QrCode, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Wifi,
  WifiOff,
  MessageSquare,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

const WhatsAppLogin = ({ onLoginSuccess, onBack }) => {
  const [qrCode, setQrCode] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const qrRefreshInterval = useRef(null)
  const connectionCheckInterval = useRef(null)

  // Generate mock QR code data
  const generateQRCode = () => {
    const mockQRData = {
      data: `https://wa.me/qr/${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      sessionId: Math.random().toString(36).substring(2, 15)
    }
    return mockQRData
  }

  // Simulate QR code generation
  const startQRGeneration = () => {
    setIsLoading(true)
    setConnectionStatus('connecting')
    
    // Simulate API call delay
    setTimeout(() => {
      const qrData = generateQRCode()
      setQrCode(qrData)
      setIsLoading(false)
      setConnectionStatus('waiting')
      
      // Start QR refresh timer
      qrRefreshInterval.current = setInterval(() => {
        if (new Date() > qrData.expiresAt) {
          refreshQRCode()
        }
      }, 1000)
    }, 2000)
  }

  // Refresh QR code
  const refreshQRCode = () => {
    if (qrRefreshInterval.current) {
      clearInterval(qrRefreshInterval.current)
    }
    startQRGeneration()
  }

  // Simulate connection check
  const startConnectionCheck = () => {
    connectionCheckInterval.current = setInterval(() => {
      // Simulate random connection success
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        handleConnectionSuccess()
      }
    }, 3000)
  }

  // Handle successful connection
  const handleConnectionSuccess = () => {
    setIsConnected(true)
    setConnectionStatus('connected')
    
    if (qrRefreshInterval.current) {
      clearInterval(qrRefreshInterval.current)
    }
    if (connectionCheckInterval.current) {
      clearInterval(connectionCheckInterval.current)
    }
    
    // Simulate getting phone number
    setTimeout(() => {
      setPhoneNumber('+90 552 036 0695')
      toast.success('WhatsApp başarıyla bağlandı!')
      
      // Call success callback after delay
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess({
            phoneNumber: '+90 552 036 0695',
            sessionId: qrCode?.sessionId,
            isConnected: true
          })
        }
      }, 2000)
    }, 1000)
  }

  // Handle manual connection
  const handleManualConnect = () => {
    setIsLoading(true)
    setConnectionStatus('connecting')
    
    setTimeout(() => {
      handleConnectionSuccess()
    }, 3000)
  }

  // Cleanup intervals on unmount
  useEffect(() => {
    startQRGeneration()
    startConnectionCheck()
    
    return () => {
      if (qrRefreshInterval.current) {
        clearInterval(qrRefreshInterval.current)
      }
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
    }
  }, [])

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <RefreshCw size={20} className="animate-spin" />
      case 'waiting':
        return <QrCode size={20} />
      case 'connected':
        return <CheckCircle size={20} />
      default:
        return <AlertCircle size={20} />
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'text-blue-500'
      case 'waiting':
        return 'text-yellow-500'
      case 'connected':
        return 'text-green-500'
      default:
        return 'text-red-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Bağlanıyor...'
      case 'waiting':
        return 'QR kodu bekleniyor'
      case 'connected':
        return 'Bağlandı'
      default:
        return 'Bağlantı hatası'
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--background-secondary)',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: 'var(--background-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            fontSize: '1.5rem'
          }}>
            <MessageSquare size={30} />
          </div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)', 
            margin: '0 0 0.5rem 0' 
          }}>
            WhatsApp Web
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            margin: 0,
            fontSize: '0.875rem'
          }}>
            QR kod ile giriş yapın
          </p>
        </div>

        {/* Connection Status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.75rem',
          backgroundColor: 'var(--background-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-primary)',
            fontWeight: '500'
          }}>
            {getStatusText()}
          </span>
        </div>

        {/* QR Code Area */}
        {!isConnected && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {isLoading ? (
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: 'var(--background-secondary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '2px dashed var(--border-color)'
              }}>
                <RefreshCw size={40} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
              </div>
            ) : (
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <QrCode size={150} style={{ color: '#25D366' }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquare size={20} style={{ color: '#25D366' }} />
                </div>
              </div>
            )}
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              margin: '1rem 0 0 0',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {isLoading 
                ? 'QR kod oluşturuluyor...' 
                : 'Telefonunuzda WhatsApp\'ı açın ve QR kodu tarayın'
              }
            </p>
          </div>
        )}

        {/* Connected Status */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '1.5rem' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '2rem'
            }}>
              <CheckCircle size={40} />
            </div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)', 
              margin: '0 0 0.5rem 0' 
            }}>
              Bağlantı Başarılı!
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              margin: '0 0 1rem 0',
              fontSize: '0.875rem'
            }}>
              {phoneNumber}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!isConnected ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshQRCode}
                disabled={isLoading}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <RefreshCw size={16} />
                QR Kodu Yenile
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleManualConnect}
                disabled={isLoading}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(0,0,0,0)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Smartphone size={16} />
                Manuel Bağlan (Test)
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLoginSuccess && onLoginSuccess({
                phoneNumber,
                sessionId: qrCode?.sessionId,
                isConnected: true
              })}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <MessageSquare size={16} />
              Mesajlaşmaya Başla
            </motion.button>
          )}
          
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(0,0,0,0)',
                color: 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <ArrowLeft size={16} />
              Geri Dön
            </motion.button>
          )}
        </div>

        {/* Instructions */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: 'var(--background-secondary)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)', 
            margin: '0 0 0.5rem 0' 
          }}>
            Nasıl Bağlanır?
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1rem' }}>
            <li>Telefonunuzda WhatsApp\'ı açın</li>
            <li>Ayarlar &gt; Bağlı Cihazlar\'a gidin</li>
            <li>"Cihaz Bağla" butonuna dokunun</li>
            <li>QR kodu tarayın</li>
          </ol>
        </div>
      </motion.div>
    </div>
  )
}

export default WhatsAppLogin
