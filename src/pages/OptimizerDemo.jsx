import React, { useState } from 'react';
import { runOptimizerTests, getTestResults } from '../utils/testOptimizer.js';
import CursorAIOptimizer from '../utils/cursorOptimizer.js';

const OptimizerDemo = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [optimizer] = useState(() => new CursorAIOptimizer());

  const runTests = async () => {
    setIsRunning(true);
    
    // Console'a yönlendir
    console.clear();
    runOptimizerTests();
    
    // Test sonuçlarını al
    const results = getTestResults();
    setTestResults(results);
    setIsRunning(false);
  };

  const generateComponent = () => {
    const component = optimizer.generateComponent('DemoForm', 'form', {
      name: 'string',
      email: 'string',
      age: 'number'
    });
    
    console.log('Generated Component:', component);
    alert('Component üretildi! Console\'u kontrol edin.');
  };

  const searchComponents = () => {
    const searchResult = optimizer.searchComponents('form validation');
    console.log('Search Result:', searchResult);
    alert('Arama sonucu! Console\'u kontrol edin.');
  };

  const analyzeContext = () => {
    const context = optimizer.analyzeProjectContext();
    console.log('Project Context:', context);
    alert('Context analizi! Console\'u kontrol edin.');
  };

  return (
    <div className="optimizer-demo">
      <div className="demo-header">
        <h1>🚀 Cursor AI Optimizer Demo</h1>
        <p>Cursor AI Agent optimizasyon sistemini test edin</p>
      </div>

      <div className="demo-controls">
        <button 
          onClick={runTests} 
          disabled={isRunning}
          className="demo-button primary"
        >
          {isRunning ? 'Testler Çalışıyor...' : '🧪 Tüm Testleri Çalıştır'}
        </button>

        <button 
          onClick={generateComponent} 
          className="demo-button"
        >
          📝 Component Üret
        </button>

        <button 
          onClick={searchComponents} 
          className="demo-button"
        >
          🔍 Component Ara
        </button>

        <button 
          onClick={analyzeContext} 
          className="demo-button"
        >
          🎯 Context Analiz Et
        </button>
      </div>

      {testResults && (
        <div className="test-results">
          <h2>📊 Test Sonuçları</h2>
          
          <div className="result-grid">
            <div className="result-card">
              <h3>Component Üretimi</h3>
              <p>Tip: {testResults.componentGeneration.type}</p>
              <p>Optimizasyonlar: {Object.keys(testResults.componentGeneration.optimizations).length}</p>
            </div>

            <div className="result-card">
              <h3>Service Üretimi</h3>
              <p>Tip: {testResults.serviceGeneration.type}</p>
              <p>Optimizasyonlar: {Object.keys(testResults.serviceGeneration.optimizations).length}</p>
            </div>

            <div className="result-card">
              <h3>Hook Üretimi</h3>
              <p>Tip: {testResults.hookGeneration.type}</p>
              <p>Optimizasyonlar: {Object.keys(testResults.hookGeneration.optimizations).length}</p>
            </div>

            <div className="result-card">
              <h3>Arama Sonuçları</h3>
              <p>Pattern: {testResults.searchResults.pattern}</p>
              <p>Öneriler: {testResults.searchResults.suggestions?.length || 0}</p>
            </div>

            <div className="result-card">
              <h3>Proje Bağlamı</h3>
              <p>Pattern Sayısı: {Object.keys(testResults.projectContext.patterns || {}).length}</p>
              <p>Çok Dilli: {testResults.projectContext.multiLanguage ? 'Evet' : 'Hayır'}</p>
            </div>

            <div className="result-card">
              <h3>Performans Raporu</h3>
              <p>Metrik Sayısı: {Object.keys(testResults.performanceReport.metrics).length}</p>
              <p>Öneri Sayısı: {testResults.performanceReport.recommendations.length}</p>
            </div>
          </div>
        </div>
      )}

      <div className="demo-info">
        <h2>📋 Sistem Özellikleri</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Hızlı Kod Üretimi</h3>
            <ul>
              <li>Component template'leri</li>
              <li>Service pattern'leri</li>
              <li>Hook template'leri</li>
              <li>Otomatik TypeScript</li>
              <li>PropTypes ve JSDoc</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>🔍 Akıllı Arama</h3>
            <ul>
              <li>Pattern matching</li>
              <li>Semantic search</li>
              <li>Fuzzy search</li>
              <li>Context awareness</li>
              <li>Otomatik öneriler</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>📝 Kod Snippet'leri</h3>
            <ul>
              <li>React snippet'leri</li>
              <li>Form snippet'leri</li>
              <li>API snippet'leri</li>
              <li>Test snippet'leri</li>
              <li>Performance snippet'leri</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>⚙️ Performans Optimizasyonu</h3>
            <ul>
              <li>Bundle optimization</li>
              <li>Image optimization</li>
              <li>Caching strategies</li>
              <li>Performance monitoring</li>
              <li>Budget tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-usage">
        <h2>🚀 Kullanım Örnekleri</h2>
        
        <div className="usage-examples">
          <div className="example-card">
            <h3>Component Üretimi</h3>
            <pre>{`const formComponent = optimizer.generateComponent(
  'UserForm', 
  'form', 
  { name: 'string', email: 'string' }
);`}</pre>
          </div>

          <div className="example-card">
            <h3>Akıllı Arama</h3>
            <pre>{`const searchResult = optimizer.searchComponents(
  'form validation'
);`}</pre>
          </div>

          <div className="example-card">
            <h3>Context Analizi</h3>
            <pre>{`const context = optimizer.analyzeProjectContext();
const fileContext = optimizer.analyzeFileContext(
  'src/components/UserForm.jsx'
);`}</pre>
          </div>

          <div className="example-card">
            <h3>Performans İzleme</h3>
            <pre>{`optimizer.trackPerformance('pageLoadTime', 2500);
const report = optimizer.getPerformanceReport();`}</pre>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <p>
          <strong>💡 İpucu:</strong> Console'u açık tutun ve testleri çalıştırın. 
          Tüm sonuçları console'da görebilirsiniz.
        </p>
        <p>
          <strong>📖 Daha fazla bilgi için:</strong> 
          <code>CURSOR_AI_OPTIMIZATION_GUIDE.md</code> dosyasını inceleyin.
        </p>
      </div>

      <style jsx>{`
        .optimizer-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .demo-header h1 {
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .demo-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .demo-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-button.primary {
          background: #2563eb;
          color: white;
        }

        .demo-button.primary:hover {
          background: #1d4ed8;
        }

        .demo-button:not(.primary) {
          background: #f3f4f6;
          color: #374151;
        }

        .demo-button:not(.primary):hover {
          background: #e5e7eb;
        }

        .demo-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .test-results {
          margin-bottom: 3rem;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .result-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .result-card h3 {
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .feature-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .feature-card h3 {
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .feature-card ul {
          list-style: none;
          padding: 0;
        }

        .feature-card li {
          padding: 0.25rem 0;
          color: #374151;
        }

        .feature-card li:before {
          content: "✓ ";
          color: #10b981;
          font-weight: bold;
        }

        .usage-examples {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .example-card {
          background: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .example-card h3 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }

        .example-card pre {
          background: #111827;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .demo-footer {
          margin-top: 3rem;
          padding: 2rem;
          background: #f0f9ff;
          border-radius: 0.5rem;
          border: 1px solid #bae6fd;
        }

        .demo-footer p {
          margin: 0.5rem 0;
          color: #0c4a6e;
        }

        .demo-footer code {
          background: #e0f2fe;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        @media (max-width: 768px) {
          .optimizer-demo {
            padding: 1rem;
          }

          .demo-controls {
            flex-direction: column;
            align-items: center;
          }

          .demo-button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizerDemo;
