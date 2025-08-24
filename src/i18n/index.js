import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Dil dosyalarını import et
import trTranslations from './locales/tr.json'
import ruTranslations from './locales/ru.json'

const resources = {
  tr: {
    translation: trTranslations
  },
  ru: {
    translation: ruTranslations
  }
}

i18n
  // Dil algılamayı etkinleştir
  .use(LanguageDetector)
  // react-i18next'i başlat
  .use(initReactI18next)
  // i18n'i initialize et
  .init({
    resources,
    
    // Varsayılan dil
    fallbackLng: 'tr',
    
    // Debug mode (development ortamında)
    debug: false,
    
    // React 19 uyumluluğu
    react: {
      useSuspense: false
    },
    
    // Dil algılama ayarları
    detection: {
      // Dil alg��lama yöntemleri (sırasıyla denenir)
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // localStorage key'i
      lookupLocalStorage: 'kafkasder_language',
      
      // Cache kullanıcı tercihlerini localStorage'a kaydet
      caches: ['localStorage'],
      
      // Sadece desteklenen dilleri kabul et
      checkForSupportedLanguage: true
    },
    
    // Sadece bu dilleri destekle
    supportedLngs: ['tr', 'ru'],
    
    // Namespace kullanma
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Interpolasyon ayarları
    interpolation: {
      // React'te XSS koruması var, escape etmeye gerek yok
      escapeValue: false
    },
    
    // Çeviri kayıp olduğunda
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    },
    
    // React ayarları
    react: {
      // Trans component'i için
      useSuspense: false,
      
      // Bind events to loaded resources
      bindI18n: 'languageChanged loaded',
      
      // Bind events to loading resources
      bindI18nStore: 'added removed',
      
      // Namespace'leri otomatik yükle
      nsMode: 'default'
    }
  })

// Add format functions using the new i18next approach
i18n.services.formatter.add('date', (value, lng, options) => {
  return new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(new Date(value))
})

i18n.services.formatter.add('time', (value, lng, options) => {
  return new Intl.DateTimeFormat(lng, {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(new Date(value))
})

i18n.services.formatter.add('datetime', (value, lng, options) => {
  return new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(new Date(value))
})

i18n.services.formatter.add('currency', (value, lng, options) => {
  const currency = lng === 'tr' ? 'TRY' : 'RUB'
  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: currency,
    ...options
  }).format(value)
})

i18n.services.formatter.add('number', (value, lng, options) => {
  return new Intl.NumberFormat(lng, options).format(value)
})

// Dil değiştirme fonksiyonu
export const changeLanguage = (lng) => {
  return i18n.changeLanguage(lng)
}

// Mevcut dili al
export const getCurrentLanguage = () => {
  return i18n.language
}

// Desteklenen dilleri al
export const getSupportedLanguages = () => {
  return ['tr', 'ru']
}

// Dil bilgilerini al
export const getLanguageInfo = (lng) => {
  const languageInfo = {
    tr: {
      name: 'Türkçe',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
      direction: 'ltr'
    },
    ru: {
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      direction: 'ltr'
    }
  }
  
  return languageInfo[lng] || languageInfo.tr
}

// Format helpers
export const formatDate = (date, lng = getCurrentLanguage()) => {
  return new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatTime = (date, lng = getCurrentLanguage()) => {
  return new Intl.DateTimeFormat(lng, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export const formatDateTime = (date, lng = getCurrentLanguage()) => {
  return new Intl.DateTimeFormat(lng, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export const formatCurrency = (amount, lng = getCurrentLanguage()) => {
  // Türkçe için TRY, Rusça için RUB
  const currency = lng === 'tr' ? 'TRY' : 'RUB'
  
  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatNumber = (number, lng = getCurrentLanguage()) => {
  return new Intl.NumberFormat(lng).format(number)
}

// Relative time formatter
export const formatRelativeTime = (date, lng = getCurrentLanguage()) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now - targetDate) / 1000)
  
  const rtf = new Intl.RelativeTimeFormatter(lng, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

export default i18n
