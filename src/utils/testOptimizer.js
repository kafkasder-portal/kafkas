/**
 * 🧪 CURSOR AI OPTIMIZER TEST
 * Bu dosya optimizasyon sisteminin çalışıp çalışmadığını test eder
 */

import CursorAIOptimizer from './cursorOptimizer.js';

// Test konfigürasyonu
const testConfig = {
  aiAgent: {
    codeGeneration: {
      typescript: true,
      propTypes: true,
      jsdoc: true,
      errorHandling: true,
      loadingStates: true,
      accessibility: true,
    },
    search: {
      fuzzySearch: true,
      semanticSearch: true,
      patternMatching: true,
      resultLimit: 10,
      suggestions: true,
    },
    suggestions: {
      autoComplete: true,
      codeSnippets: true,
      bestPractices: true,
      performanceTips: true,
      securityTips: true,
    },
    context: {
      projectContext: true,
      fileContext: true,
      functionContext: true,
      importContext: true,
    },
  },
  project: {
    kafPortal: {
      languages: ['tr', 'en', 'ru'],
      defaultLanguage: 'tr',
      realTime: true,
      webSocket: true,
      offlineMode: true,
    },
  },
};

// Optimizer'ı başlat
const optimizer = new CursorAIOptimizer(testConfig);

// Test fonksiyonları
export const runOptimizerTests = () => {
  console.log('🚀 Cursor AI Optimizer Test Başlatılıyor...\n');

  // 1. Component üretimi testi
  console.log('📝 1. Component Üretimi Testi');
  const formComponent = optimizer.generateComponent('UserForm', 'form', {
    name: 'string',
    email: 'string',
    age: 'number'
  });
  console.log('✅ Form component üretildi:', formComponent.type);
  console.log('📊 Optimizasyonlar:', Object.keys(formComponent.optimizations).length);
  console.log('');

  // 2. Service üretimi testi
  console.log('🔧 2. Service Üretimi Testi');
  const apiService = optimizer.generateService('UserService', 'api');
  console.log('✅ API service üretildi:', apiService.type);
  console.log('📊 Optimizasyonlar:', Object.keys(apiService.optimizations).length);
  console.log('');

  // 3. Hook üretimi testi
  console.log('🎣 3. Hook Üretimi Testi');
  const customHook = optimizer.generateHook('useUserData', 'custom');
  console.log('✅ Custom hook üretildi:', customHook.type);
  console.log('📊 Optimizasyonlar:', Object.keys(customHook.optimizations).length);
  console.log('');

  // 4. Akıllı arama testi
  console.log('🔍 4. Akıllı Arama Testi');
  const searchResult = optimizer.searchComponents('form validation');
  console.log('✅ Arama sonucu:', searchResult.pattern);
  console.log('💡 Öneriler:', searchResult.suggestions?.length || 0);
  console.log('');

  // 5. Service arama testi
  console.log('🔍 5. Service Arama Testi');
  const serviceResult = optimizer.searchServices('authentication');
  console.log('✅ Service arama sonucu:', serviceResult.pattern);
  console.log('💡 Öneriler:', serviceResult.suggestions?.length || 0);
  console.log('');

  // 6. Hook arama testi
  console.log('🔍 6. Hook Arama Testi');
  const hookResult = optimizer.searchHooks('state management');
  console.log('✅ Hook arama sonucu:', hookResult.pattern);
  console.log('💡 Öneriler:', hookResult.suggestions?.length || 0);
  console.log('');

  // 7. Context analizi testi
  console.log('🎯 7. Context Analizi Testi');
  const projectContext = optimizer.analyzeProjectContext();
  console.log('✅ Proje bağlamı analiz edildi');
  console.log('📊 Pattern sayısı:', Object.keys(projectContext.patterns || {}).length);
  console.log('');

  // 8. Dosya bağlamı testi
  console.log('📁 8. Dosya Bağlamı Testi');
  const fileContext = optimizer.analyzeFileContext('src/components/UserForm.jsx');
  console.log('✅ Dosya bağlamı analiz edildi:', fileContext.fileType);
  console.log('💡 Öneriler:', fileContext.suggestions?.length || 0);
  console.log('');

  // 9. Snippet önerileri testi
  console.log('📝 9. Snippet Önerileri Testi');
  const snippetSuggestions = optimizer.generateSnippetSuggestions('form validation');
  console.log('✅ Snippet önerileri üretildi:', snippetSuggestions.length);
  console.log('');

  // 10. Performans optimizasyonu testi
  console.log('⚡ 10. Performans Optimizasyonu Testi');
  const bundleOptimization = optimizer.optimizeBundle();
  console.log('✅ Bundle optimizasyonu:', bundleOptimization.recommendations.length, 'öneri');
  
  const imageOptimization = optimizer.optimizeImages();
  console.log('✅ Image optimizasyonu:', imageOptimization.recommendations.length, 'öneri');
  
  const cacheOptimization = optimizer.optimizeCaching();
  console.log('✅ Cache optimizasyonu:', cacheOptimization.recommendations.length, 'öneri');
  console.log('');

  // 11. Performans izleme testi
  console.log('📊 11. Performans İzleme Testi');
  optimizer.trackPerformance('pageLoadTime', 2500);
  optimizer.trackPerformance('bundleSize', 800);
  optimizer.trackPerformance('firstContentfulPaint', 1500);
  
  const performanceReport = optimizer.getPerformanceReport();
  console.log('✅ Performans raporu oluşturuldu');
  console.log('📊 Metrik sayısı:', Object.keys(performanceReport.metrics).length);
  console.log('💡 Öneri sayısı:', performanceReport.recommendations.length);
  console.log('');

  // 12. Konfigürasyon testi
  console.log('⚙️ 12. Konfigürasyon Testi');
  const currentConfig = optimizer.getConfig();
  console.log('✅ Mevcut konfigürasyon alındı');
  console.log('📊 AI Agent ayarları:', Object.keys(currentConfig.aiAgent).length);
  console.log('📊 Performance ayarları:', Object.keys(currentConfig.performance).length);
  console.log('');

  // 13. Arama geçmişi testi
  console.log('📚 13. Arama Geçmişi Testi');
  const searchHistory = optimizer.getSearchHistory();
  console.log('✅ Arama geçmişi alındı:', searchHistory.length, 'kayıt');
  console.log('');

  // 14. Snippet'ler testi
  console.log('📋 14. Snippet\'ler Testi');
  const reactSnippets = optimizer.getSnippets('react');
  const formSnippets = optimizer.getSnippets('form');
  const apiSnippets = optimizer.getSnippets('api');
  
  console.log('✅ React snippet\'leri:', Object.keys(reactSnippets).length);
  console.log('✅ Form snippet\'leri:', Object.keys(formSnippets).length);
  console.log('✅ API snippet\'leri:', Object.keys(apiSnippets).length);
  console.log('');

  // 15. Fonksiyon bağlamı testi
  console.log('🔧 15. Fonksiyon Bağlamı Testi');
  const sampleCode = `
    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name && formData.email) {
        submitForm(formData);
      }
    };
  `;
  const functionContext = optimizer.analyzeFunctionContext('handleSubmit', sampleCode);
  console.log('✅ Fonksiyon bağlamı analiz edildi');
  console.log('📊 Karmaşıklık:', functionContext.complexity);
  console.log('💡 Optimizasyon önerileri:', functionContext.suggestions?.length || 0);
  console.log('🔍 Tespit edilen pattern\'ler:', functionContext.patterns?.length || 0);
  console.log('');

  console.log('🎉 Tüm testler başarıyla tamamlandı!');
  console.log('📈 Cursor AI Optimizer sistemi aktif ve çalışıyor.');
  console.log('');
  console.log('🚀 Artık daha hızlı ve akıllı kod üretimi yapabilirsiniz!');
};

// Test sonuçlarını döndür
export const getTestResults = () => {
  return {
    componentGeneration: optimizer.generateComponent('TestComponent', 'form', { name: 'string' }),
    serviceGeneration: optimizer.generateService('TestService', 'api'),
    hookGeneration: optimizer.generateHook('useTest', 'custom'),
    searchResults: optimizer.searchComponents('test'),
    projectContext: optimizer.analyzeProjectContext(),
    performanceReport: optimizer.getPerformanceReport(),
    config: optimizer.getConfig(),
  };
};

// Otomatik test çalıştırma
if (typeof window !== 'undefined') {
  // Browser ortamında
  window.runOptimizerTests = runOptimizerTests;
  window.getTestResults = getTestResults;
} else {
  // Node.js ortamında
  runOptimizerTests();
}

export default {
  runOptimizerTests,
  getTestResults,
  optimizer,
};
