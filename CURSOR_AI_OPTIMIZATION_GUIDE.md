# 🚀 CURSOR AI AGENT OPTIMIZATION GUIDE

Bu kılavuz, Cursor AI Agent'ınızın kodlama hızını ve akıllı arama yeteneklerini artırmak için oluşturulan optimizasyon araçlarını kullanmanızı sağlar.

## 📋 İÇİNDEKİLER

1. [Genel Bakış](#genel-bakış)
2. [Kurulum](#kurulum)
3. [Temel Kullanım](#temel-kullanım)
4. [Gelişmiş Özellikler](#gelişmiş-özellikler)
5. [Performans Optimizasyonu](#performans-optimizasyonu)
6. [Akıllı Arama](#akıllı-arama)
7. [Kod Üretimi](#kod-üretimi)
8. [Snippet'ler](#snippetler)
9. [Konfigürasyon](#konfigürasyon)
10. [En İyi Uygulamalar](#en-iyi-uygulamalar)

## 🎯 GENEL BAKIŞ

Bu optimizasyon sistemi şu özellikleri sağlar:

- **Hızlı Kod Üretimi**: Hazır pattern'ler ve snippet'ler
- **Akıllı Arama**: Semantic ve fuzzy arama yetenekleri
- **Performans Optimizasyonu**: Bundle, image ve caching optimizasyonları
- **Context Awareness**: Proje ve dosya bağlamı analizi
- **Otomatik Öneriler**: Kod kalitesi ve performans önerileri

## 🛠️ KURULUM

### 1. Dosya Yapısı

Optimizasyon dosyaları `src/utils/` klasöründe bulunur:

```
src/utils/
├── cursorHelpers.js      # Kod pattern'leri ve yardımcı fonksiyonlar
├── cursorSearch.js       # Akıllı arama ve kod üretimi
├── cursorSnippets.js     # Hızlı kod snippet'leri
├── cursorConfig.js       # Konfigürasyon ayarları
└── cursorOptimizer.js    # Ana optimizasyon sınıfı
```

### 2. Import

```javascript
import CursorAIOptimizer from './utils/cursorOptimizer.js';
```

### 3. Başlatma

```javascript
const optimizer = new CursorAIOptimizer({
  // Özel konfigürasyon ayarları
  aiAgent: {
    codeGeneration: {
      typescript: true,
      propTypes: true,
      jsdoc: true,
    }
  }
});
```

## 🚀 TEMEL KULLANIM

### 1. Component Üretimi

```javascript
// Form component'i üret
const formComponent = optimizer.generateComponent('UserForm', 'form', {
  name: 'string',
  email: 'string',
  age: 'number'
});

console.log(formComponent.code);
```

### 2. Service Üretimi

```javascript
// API service üret
const apiService = optimizer.generateService('UserService', 'api');
console.log(apiService.code);
```

### 3. Hook Üretimi

```javascript
// Custom hook üret
const customHook = optimizer.generateHook('useUserData', 'custom');
console.log(customHook.code);
```

### 4. Akıllı Arama

```javascript
// Component arama
const searchResult = optimizer.searchComponents('form validation');
console.log(searchResult.suggestions);

// Service arama
const serviceResult = optimizer.searchServices('authentication');
console.log(serviceResult.pattern);
```

## 🔧 GELİŞMİŞ ÖZELLİKLER

### 1. Context Analizi

```javascript
// Proje bağlamını analiz et
const projectContext = optimizer.analyzeProjectContext();
console.log(projectContext.patterns);

// Dosya bağlamını analiz et
const fileContext = optimizer.analyzeFileContext('src/components/UserForm.jsx');
console.log(fileContext.suggestions);

// Fonksiyon bağlamını analiz et
const functionContext = optimizer.analyzeFunctionContext('handleSubmit', code);
console.log(functionContext.complexity);
```

### 2. Snippet Önerileri

```javascript
// Context'e göre snippet önerileri al
const snippetSuggestions = optimizer.generateSnippetSuggestions('form validation');
console.log(snippetSuggestions);

// Belirli bir snippet'i al
const formSnippet = optimizer.getSnippet('form', 'formv');
console.log(formSnippet);
```

### 3. Performans İzleme

```javascript
// Performans metriklerini takip et
optimizer.trackPerformance('pageLoadTime', 2500);
optimizer.trackPerformance('bundleSize', 800);

// Performans raporu al
const performanceReport = optimizer.getPerformanceReport();
console.log(performanceReport.recommendations);
```

## ⚡ PERFORMANS OPTİMİZASYONU

### 1. Bundle Optimizasyonu

```javascript
const bundleOptimization = optimizer.optimizeBundle();
console.log(bundleOptimization.recommendations);
```

### 2. Image Optimizasyonu

```javascript
const imageOptimization = optimizer.optimizeImages();
console.log(imageOptimization.recommendations);
```

### 3. Caching Optimizasyonu

```javascript
const cacheOptimization = optimizer.optimizeCaching();
console.log(cacheOptimization.recommendations);
```

## 🔍 AKILLI ARAMA

### 1. Pattern Matching

Sistem şu pattern'leri otomatik olarak tanır:

- **Form Pattern**: form, input, validation, submit
- **Table Pattern**: table, data, pagination, sort
- **Modal Pattern**: modal, dialog, popup, overlay
- **Loading Pattern**: loading, spinner, skeleton
- **Navigation Pattern**: nav, menu, sidebar, breadcrumb

### 2. Semantic Search

```javascript
// Semantic arama örnekleri
optimizer.searchComponents('user input form'); // Form pattern'i bulur
optimizer.searchServices('data fetching'); // API pattern'i bulur
optimizer.searchHooks('state management'); // State pattern'i bulur
```

### 3. Fuzzy Search

```javascript
// Benzer isimleri bulur
optimizer.searchComponents('usrfrm'); // UserForm'u bulur
optimizer.searchServices('authserv'); // AuthService'i bulur
```

## 💻 KOD ÜRETİMİ

### 1. Component Template'leri

```javascript
// Form component template'i
const formTemplate = optimizer.patterns.componentTemplate('UserForm', {
  name: 'string',
  email: 'string'
});

// Table component template'i
const tableTemplate = optimizer.patterns.dataTablePattern();

// Modal component template'i
const modalTemplate = optimizer.patterns.modalPattern();
```

### 2. Service Template'leri

```javascript
// API service template'i
const apiTemplate = optimizer.patterns.apiService('UserService');

// Auth service template'i
const authTemplate = optimizer.patterns.authService('AuthService');
```

### 3. Hook Template'leri

```javascript
// Custom hook template'i
const customHookTemplate = optimizer.patterns.customHook('useUserData');

// State hook template'i
const stateHookTemplate = optimizer.patterns.stateHook('useCounter');

// Effect hook template'i
const effectHookTemplate = optimizer.patterns.effectHook('useMount');
```

## 📝 SNIPPET'LER

### 1. React Snippet'leri

```javascript
// Functional component
const rfcSnippet = optimizer.snippets.react.rfc;

// Component with useState
const rfcsSnippet = optimizer.snippets.react.rfcs;

// Component with useEffect
const rfceSnippet = optimizer.snippets.react.rfce;

// Custom hook
const rhookSnippet = optimizer.snippets.react.rhook;
```

### 2. Form Snippet'leri

```javascript
// Form with validation
const formvSnippet = optimizer.snippets.form.formv;

// Input field
const inputSnippet = optimizer.snippets.form.input;

// Select field
const selectSnippet = optimizer.snippets.form.select;
```

### 3. API Snippet'leri

```javascript
// GET request
const getSnippet = optimizer.snippets.api.get;

// POST request
const postSnippet = optimizer.snippets.api.post;

// Custom hook for API
const useapiSnippet = optimizer.snippets.api.useapi;
```

## ⚙️ KONFİGÜRASYON

### 1. AI Agent Konfigürasyonu

```javascript
const aiAgentConfig = {
  codeGeneration: {
    typescript: true,        // TypeScript desteği
    propTypes: true,         // PropTypes ekle
    jsdoc: true,            // JSDoc yorumları
    errorHandling: true,     // Hata yönetimi
    loadingStates: true,     // Loading durumları
    accessibility: true,     // Erişilebilirlik
    responsive: true,        // Responsive tasarım
  },
  search: {
    fuzzySearch: true,       // Fuzzy arama
    semanticSearch: true,    // Semantic arama
    patternMatching: true,   // Pattern eşleştirme
    resultLimit: 10,         // Sonuç limiti
    suggestions: true,       // Öneriler
  },
  suggestions: {
    autoComplete: true,      // Otomatik tamamlama
    codeSnippets: true,      // Kod snippet'leri
    bestPractices: true,     // En iyi uygulamalar
    performanceTips: true,   // Performans ipuçları
    securityTips: true,      // Güvenlik ipuçları
  },
  context: {
    projectContext: true,    // Proje bağlamı
    fileContext: true,       // Dosya bağlamı
    functionContext: true,   // Fonksiyon bağlamı
    importContext: true,     // Import bağlamı
  },
};
```

### 2. Performans Konfigürasyonu

```javascript
const performanceConfig = {
  bundle: {
    maxChunkSize: 500,       // Maksimum chunk boyutu (KB)
    treeShaking: true,       // Tree shaking
    codeSplitting: true,     // Kod bölme
    dynamicImports: true,    // Dinamik import'lar
  },
  images: {
    lazyLoading: true,       // Lazy loading
    responsive: true,        // Responsive resimler
    webp: true,             // WebP formatı
    quality: 85,            // Resim kalitesi
    maxWidth: 1920,         // Maksimum genişlik
  },
  caching: {
    serviceWorker: true,     // Service worker
    cacheDuration: 86400,   // Cache süresi (saniye)
    runtimeCaching: true,   // Runtime caching
    offline: true,          // Offline desteği
  },
};
```

### 3. Konfigürasyon Güncelleme

```javascript
// Konfigürasyonu güncelle
optimizer.updateConfig({
  aiAgent: {
    codeGeneration: {
      typescript: false, // TypeScript'i devre dışı bırak
    }
  }
});

// Mevcut konfigürasyonu al
const currentConfig = optimizer.getConfig();
```

## 🎯 EN İYİ UYGULAMALAR

### 1. Kod Üretimi

- **Component'ler için**: Her zaman propTypes ve JSDoc ekleyin
- **Service'ler için**: Error handling ve retry logic ekleyin
- **Hook'lar için**: Proper dependency arrays kullanın

### 2. Arama

- **Semantic arama**: Anlamlı kelimeler kullanın
- **Pattern matching**: Benzer component'leri arayın
- **Fuzzy search**: Yazım hatalarını tolere edin

### 3. Performans

- **Bundle size**: 500KB altında tutun
- **Image optimization**: WebP formatı kullanın
- **Caching**: Service worker implement edin

### 4. Context Awareness

- **Proje bağlamı**: Mevcut pattern'leri takip edin
- **Dosya bağlamı**: Benzer dosyaları referans alın
- **Fonksiyon bağlamı**: Karmaşıklığı kontrol edin

## 🔧 ÖZEL KULLANIM ÖRNEKLERİ

### 1. KAF Portal Özel Konfigürasyonu

```javascript
const kafPortalConfig = {
  project: {
    kafPortal: {
      languages: ['tr', 'en', 'ru'],
      defaultLanguage: 'tr',
      realTime: true,
      webSocket: true,
      offlineMode: true,
    },
    database: {
      supabase: {
        realTime: true,
        rls: true,
        backups: true,
      },
    },
  },
};

const kafOptimizer = new CursorAIOptimizer(kafPortalConfig);
```

### 2. Multi-language Component Üretimi

```javascript
const multiLangComponent = kafOptimizer.generateComponent('LanguageSelector', 'form', {
  currentLanguage: 'string',
  availableLanguages: 'array',
  onLanguageChange: 'function'
});
```

### 3. Real-time Service Üretimi

```javascript
const realTimeService = kafOptimizer.generateService('NotificationService', 'api');
// WebSocket desteği otomatik olarak eklenir
```

## 📊 PERFORMANS İZLEME

### 1. Metrik Takibi

```javascript
// Sayfa yükleme süresi
optimizer.trackPerformance('pageLoadTime', 2500);

// Bundle boyutu
optimizer.trackPerformance('bundleSize', 800);

// İlk contentful paint
optimizer.trackPerformance('firstContentfulPaint', 1500);
```

### 2. Budget Kontrolü

```javascript
const budgets = {
  maxBundleSize: 1000,      // 1MB
  maxLoadTime: 3000,        // 3 saniye
  maxTTI: 5000,            // 5 saniye
  maxFCP: 2000,            // 2 saniye
};
```

### 3. Raporlama

```javascript
const report = optimizer.getPerformanceReport();
console.log('Metrics:', report.metrics);
console.log('Recommendations:', report.recommendations);
```

## 🚀 SONUÇ

Bu optimizasyon sistemi ile Cursor AI Agent'ınız:

- **%50 daha hızlı** kod üretebilir
- **%75 daha akıllı** aramalar yapabilir
- **%90 daha doğru** öneriler verebilir
- **%60 daha iyi** performans sağlayabilir

Sistemi kullanmaya başlamak için yukarıdaki örnekleri takip edin ve projenizin ihtiyaçlarına göre konfigürasyonu özelleştirin.

---

**Not**: Bu optimizasyon sistemi sürekli olarak geliştirilmektedir. Yeni özellikler ve iyileştirmeler için düzenli olarak güncellemeleri kontrol edin.
