import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import i18n, { getCurrentLanguage, getLanguageInfo, getSupportedLanguages } from '../i18n'

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { t: _t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage())
  const dropdownRef = useRef(null)
  const supportedLanguages = getSupportedLanguages()

  // Dil değişikliklerini dinle
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(i18n.language)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  // Dışarıda tıklandığında dropdown'u kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleLanguageChange = async (langCode) => {
    try {
      await i18n.changeLanguage(langCode)
      setCurrentLang(langCode)
      setIsOpen(false)

      // Force re-render by triggering a custom event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }))
    } catch (error) {
      console.error('Dil değiştirme hatası:', error)
    }
  }

  // Toggle variant - sadece iki dil arasında geçiş
  if (variant === 'toggle') {
    const otherLang = currentLang === 'tr' ? 'ru' : 'tr'
    const currentInfo = getLanguageInfo(currentLang)
    const otherInfo = getLanguageInfo(otherLang)

    return (
      <motion.button
        onClick={() => handleLanguageChange(otherLang)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.2s ease'
        }}
        title={`Dil Seçin: ${otherInfo.nativeName}`}
      >
        <span>{currentInfo.flag}</span>
        <span>{currentInfo.nativeName}</span>
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Globe size={16} />
        </motion.div>
      </motion.button>
    )
  }

  // Icon variant - sadece ikon
  if (variant === 'icon') {
    const currentInfo = getLanguageInfo(currentLang)

    return (
      <div className="language-switcher-icon" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{
            scale: 1.05
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title={`Dil Seçin: ${currentInfo.nativeName}`}
        >
          <span style={{ fontSize: '16px' }}>{currentInfo.flag}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -15,
                scale: 0.92
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '12px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '16px',
                boxShadow:
                  '0 20px 40px rgba(0, 0, 0, 0.08), ' +
                  '0 0 0 1px rgba(255, 255, 255, 0.9), ' +
                  '0 0 60px rgba(102, 126, 234, 0.05)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                zIndex: 1000,
                minWidth: '140px',
                overflow: 'hidden',
                transformOrigin: 'top right'
              }}
            >
              {supportedLanguages.map((langCode, index) => {
                const langInfo = getLanguageInfo(langCode)
                const isSelected = langCode === currentLang

                return (
                  <motion.button
                    key={langCode}
                    onClick={() => handleLanguageChange(langCode)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      x: 4
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: 'none',
                      backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.08)' : 'rgba(0,0,0,0)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: isSelected ? '#3b82f6' : '#374151',
                      fontWeight: isSelected ? '600' : '500',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
                    }}
                  >
                    <motion.span
                      style={{ fontSize: '16px' }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {langInfo.flag}
                    </motion.span>
                    <span>{langInfo.nativeName}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default dropdown variant
  const currentInfo = getLanguageInfo(currentLang)

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          minWidth: '140px',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{currentInfo.flag}</span>
          <span>{currentInfo.nativeName}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '8px 0' }}>
              {supportedLanguages.map((langCode) => {
                const langInfo = getLanguageInfo(langCode)
                const isSelected = langCode === currentLang

                return (
                  <motion.button
                    key={langCode}
                    onClick={() => handleLanguageChange(langCode)}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: isSelected ? '#f1f5f9' : 'rgba(0,0,0,0)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: isSelected ? '#3b82f6' : '#374151',
                      fontWeight: isSelected ? '600' : '400',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{langInfo.flag}</span>
                    <div>
                      <div>{langInfo.nativeName}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '400'
                      }}>
                        {langInfo.name}
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          marginLeft: 'auto',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6'
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Ayarlar bölümü */}
            <div style={{
              borderTop: '1px solid #f1f5f9',
              padding: '8px 16px',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Dil Seçin
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

LanguageSwitcher.propTypes = {
  variant: PropTypes.oneOf(['dropdown', 'toggle']),
};

export default LanguageSwitcher
