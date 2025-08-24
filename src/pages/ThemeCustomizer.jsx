import { motion } from 'framer-motion'
import {
    Download,
    Droplet, Flame, Leaf,
    Moon,
    Palette,
    RotateCcw,
    Sun,
    Upload,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

const ThemeCustomizer = () => {
  const [activeTheme, setActiveTheme] = useState('default')
  const [customColors, setCustomColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    dark: '#1f2937',
    light: '#f8fafc'
  })
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [borderRadius, setBorderRadius] = useState(8)
  const [shadows, setShadows] = useState('medium')

  const presetThemes = [
    {
      id: 'default',
      name: 'Varsayılan',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
      },
      icon: Palette
    },
    {
      id: 'ocean',
      name: 'Okyanus',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4'
      },
      icon: Droplet
    },
    {
      id: 'sunset',
      name: 'Gün Batımı',
      colors: {
        primary: '#f97316',
        secondary: '#ea580c',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#dc2626',
        info: '#3b82f6'
      },
      icon: Flame
    },
    {
      id: 'forest',
      name: 'Orman',
      colors: {
        primary: '#059669',
        secondary: '#047857',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
      },
      icon: Leaf
    },
    {
      id: 'electric',
      name: 'Elektrik',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
      },
      icon: Zap
    }
  ]

  const shadowOptions = [
    { id: 'none', name: 'Yok', value: 'none' },
    { id: 'light', name: 'Hafif', value: '0 1px 3px rgba(0,0,0,0.05)' },
    { id: 'medium', name: 'Orta', value: '0 4px 6px rgba(0,0,0,0.1)' },
    { id: 'strong', name: 'Güçlü', value: '0 10px 25px rgba(0,0,0,0.15)' }
  ]

  // Apply theme to CSS variables
  const applyTheme = (colors, options = {}) => {
    const root = document.documentElement
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    if (options.fontSize) root.style.setProperty('--font-size-base', `${options.fontSize}px`)
    if (options.borderRadius) root.style.setProperty('--border-radius', `${options.borderRadius}px`)
    if (options.shadows) {
      const shadowValue = shadowOptions.find(s => s.id === options.shadows)?.value
      root.style.setProperty('--box-shadow', shadowValue)
    }
    if (options.darkMode !== undefined) {
      root.style.setProperty('--theme-mode', options.darkMode ? 'dark' : 'light')
    }
  }

  const handlePresetSelect = (preset) => {
    setActiveTheme(preset.id)
    setCustomColors({ ...customColors, ...preset.colors })
    applyTheme(preset.colors)
  }

  const handleColorChange = (colorKey, value) => {
    const newColors = { ...customColors, [colorKey]: value }
    setCustomColors(newColors)
    applyTheme(newColors)
    setActiveTheme('custom')
  }

  const resetToDefault = () => {
    const defaultPreset = presetThemes[0]
    handlePresetSelect(defaultPreset)
    setFontSize(14)
    setBorderRadius(8)
    setShadows('medium')
    setDarkMode(false)
  }

  const exportTheme = () => {
    const themeConfig = {
      colors: customColors,
      fontSize,
      borderRadius,
      shadows,
      darkMode,
      name: 'Custom Theme',
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(themeConfig, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'theme-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importTheme = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const themeConfig = JSON.parse(e.target.result)
        setCustomColors(themeConfig.colors)
        setFontSize(themeConfig.fontSize || 14)
        setBorderRadius(themeConfig.borderRadius || 8)
        setShadows(themeConfig.shadows || 'medium')
        setDarkMode(themeConfig.darkMode || false)
        applyTheme(themeConfig.colors, {
          fontSize: themeConfig.fontSize,
          borderRadius: themeConfig.borderRadius,
          shadows: themeConfig.shadows,
          darkMode: themeConfig.darkMode
        })
        setActiveTheme('custom')
      } catch (error) {
        alert('Geçersiz tema dosyası!')
      }
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    applyTheme(customColors, { fontSize, borderRadius, shadows, darkMode })
  }, [fontSize, borderRadius, shadows, darkMode])

  return (
    <div className="page-container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Tema Özelleştirici</h1>
          <p className="page-subtitle">Uygulamanızın görünümünü kişiselleştirin</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            onClick={resetToDefault}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={16} />
            Sıfırla
          </motion.button>
          <motion.button
            onClick={exportTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Dışa Aktar
          </motion.button>
          <motion.label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload size={16} />
            İçe Aktar
            <input type="file" accept=".json" onChange={importTheme} style={{ display: 'none' }} />
          </motion.label>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Theme Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Preset Themes */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Hazır Temalar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {presetThemes.map((preset) => {
                const Icon = preset.icon
                const isActive = activeTheme === preset.id
                
                return (
                  <motion.button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem',
                      backgroundColor: isActive ? `${preset.colors.primary}15` : 'rgba(0,0,0,0)',
                      border: `2px solid ${isActive ? preset.colors.primary : '#e2e8f0'}`,
                      borderRadius: `${borderRadius}px`,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: isActive ? preset.colors.primary : '#6b7280'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={24} color={preset.colors.primary} />
                    {preset.name}
                    <div style={{ display: 'flex', gap: '2px', marginTop: '0.25rem' }}>
                      {Object.values(preset.colors).slice(0, 4).map((color, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: color,
                            borderRadius: '2px'
                          }}
                        />
                      ))}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Custom Colors */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Özel Renkler</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    textTransform: 'capitalize',
                    color: '#374151'
                  }}>
                    {key}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Gelişmiş Ayarlar</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Dark Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <span style={{ fontWeight: '500' }}>Karanlık Mod</span>
                </div>
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    width: '50px',
                    height: '25px',
                    backgroundColor: darkMode ? customColors.primary : '#d1d5db',
                    border: 'none',
                    borderRadius: '12.5px',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    style={{
                      width: '21px',
                      height: '21px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px'
                    }}
                    animate={{ x: darkMode ? 27 : 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </motion.button>
              </div>

              {/* Font Size */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Yazı Boyutu: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Border Radius */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Köşe Yuvarlaklığı: {borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Shadows */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Gölge Efekti
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {shadowOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => setShadows(option.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: shadows === option.id ? customColors.primary : 'rgba(0,0,0,0)',
                        color: shadows === option.id ? 'white' : '#6b7280',
                        border: `1px solid ${shadows === option.id ? customColors.primary : '#d1d5db'}`,
                        borderRadius: `${borderRadius}px`,
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ position: 'sticky', top: '2rem' }}
        >
          <h3 style={{ marginBottom: '1rem' }}>Önizleme</h3>
          
          <div style={{ 
            padding: '1.5rem',
            border: '2px dashed #e2e8f0',
            borderRadius: `${borderRadius}px`,
            backgroundColor: darkMode ? '#1f2937' : '#ffffff'
          }}>
            {/* Sample UI Elements */}
            <div style={{ marginBottom: '1rem' }}>
              <motion.button
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: customColors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: `${borderRadius}px`,
                  fontSize: `${fontSize}px`,
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: shadowOptions.find(s => s.id === shadows)?.value,
                  marginRight: '0.5rem'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Primary Button
              </motion.button>
              
              <motion.button
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'rgba(0,0,0,0)',
                  color: customColors.primary,
                  border: `1px solid ${customColors.primary}`,
                  borderRadius: `${borderRadius}px`,
                  fontSize: `${fontSize}px`,
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                whileHover={{ backgroundColor: `${customColors.primary}10` }}
                whileTap={{ scale: 0.95 }}
              >
                Secondary Button
              </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: `${customColors.success}15`,
                borderRadius: `${borderRadius}px`,
                border: `1px solid ${customColors.success}30`
              }}>
                <div style={{ color: customColors.success, fontWeight: '600', fontSize: `${fontSize}px` }}>
                  Success Alert
                </div>
              </div>
              
              <div style={{
                padding: '1rem',
                backgroundColor: `${customColors.warning}15`,
                borderRadius: `${borderRadius}px`,
                border: `1px solid ${customColors.warning}30`
              }}>
                <div style={{ color: customColors.warning, fontWeight: '600', fontSize: `${fontSize}px` }}>
                  Warning Alert
                </div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: darkMode ? '#374151' : '#f8fafc',
              borderRadius: `${borderRadius}px`,
              boxShadow: shadowOptions.find(s => s.id === shadows)?.value
            }}>
              <h4 style={{ 
                color: darkMode ? '#f9fafb' : '#1f2937',
                fontSize: `${fontSize + 2}px`,
                marginBottom: '0.5rem'
              }}>
                Sample Card
              </h4>
              <p style={{ 
                color: darkMode ? '#d1d5db' : '#6b7280',
                fontSize: `${fontSize}px`,
                margin: 0
              }}>
                Bu bir örnek kart bileşenidir. Tema değişikliklerini burada görebilirsiniz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ThemeCustomizer
