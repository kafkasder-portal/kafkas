# 🧪 KAF Portal Testing Guide

Bu dokümantasyon KAF Portal projesinin test altyapısını ve test yazma rehberini içerir.

## 📋 İçindekiler

- [Test Altyapısı](#test-altyapısı)
- [Test Türleri](#test-türleri)
- [Test Yazma Rehberi](#test-yazma-rehberi)
- [Test Çalıştırma](#test-çalıştırma)
- [Test Raporları](#test-raporları)
- [CI/CD Entegrasyonu](#cicd-entegrasyonu)
- [Best Practices](#best-practices)

## 🏗️ Test Altyapısı

### Kullanılan Teknolojiler

- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Cypress
- **Performance Tests**: Custom hooks + Lighthouse
- **Security Tests**: Custom utilities + OWASP ZAP
- **Accessibility Tests**: axe-core + jest-axe

### Proje Yapısı

```
src/
├── test/
│   ├── setup.js                 # Test setup ve mock'lar
│   ├── utils.js                 # Test utilities
│   ├── unit/                    # Unit testler
│   ├── integration/             # Integration testler
│   ├── components/              # Component testler
│   ├── api/                     # API testler
│   ├── utils/                   # Utility testler
│   ├── performance/             # Performance testler
│   ├── security/                # Security testler
│   └── accessibility/           # Accessibility testler
├── cypress/
│   ├── e2e/                     # E2E testler
│   ├── component/               # Component testler
│   ├── fixtures/                # Test data
│   ├── support/
│   │   ├── commands.js          # Custom commands
│   │   └── e2e.js              # E2E support
│   └── cypress.config.js        # Cypress config
```

## 🧪 Test Türleri

### 1. Unit Tests

Bireysel fonksiyonların ve utility'lerin testleri.

```javascript
// src/test/unit/validation.test.js
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from '../../utils/validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
    })
    
    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
    })
  })
})
```

### 2. Component Tests

React bileşenlerinin testleri.

```javascript
// src/test/components/SecureForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import SecureForm from '../../components/SecureForm'

describe('SecureForm', () => {
  it('should render form with fields', () => {
    renderWithProviders(<SecureForm fields={fields} onSubmit={mockOnSubmit} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
})
```

### 3. Integration Tests

Bileşenler arası etkileşimlerin testleri.

```javascript
// src/test/integration/Login.test.jsx
describe('Login Integration', () => {
  it('should handle successful login flow', async () => {
    renderWithProviders(<Login />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})
```

### 4. E2E Tests

Tam kullanıcı senaryolarının testleri.

```javascript
// cypress/e2e/login.cy.js
describe('Login E2E', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('[data-testid=email-input]').type('test@example.com')
    cy.get('[data-testid=password-input]').type('password123')
    cy.get('[data-testid=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### 5. Performance Tests

Performans metriklerinin testleri.

```javascript
// src/test/performance/ComponentPerformance.test.js
describe('Component Performance', () => {
  it('should render within acceptable time', async () => {
    const renderTime = await measureRenderTime(<LargeComponent />)
    expect(renderTime).toBeLessThan(100)
  })
})
```

### 6. Security Tests

Güvenlik özelliklerinin testleri.

```javascript
// src/test/security/SecurityFeatures.test.js
describe('Security Features', () => {
  it('should sanitize user input', () => {
    const maliciousInput = '<script>alert("xss")</script>'
    const sanitized = sanitizeInput(maliciousInput)
    expect(sanitized).not.toContain('<script>')
  })
})
```

### 7. Accessibility Tests

Erişilebilirlik standartlarının testleri.

```javascript
// src/test/accessibility/Accessibility.test.js
describe('Accessibility', () => {
  it('should meet WCAG standards', async () => {
    const { container } = renderWithProviders(<LoginForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## ✍️ Test Yazma Rehberi

### Test İsimlendirme

```javascript
// ✅ İyi örnek
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {})
    it('should throw error with invalid email', () => {})
    it('should handle duplicate email gracefully', () => {})
  })
})

// ❌ Kötü örnek
describe('UserService', () => {
  it('test1', () => {})
  it('should work', () => {})
})
```

### Test Yapısı (AAA Pattern)

```javascript
describe('UserService.createUser', () => {
  it('should create user successfully', async () => {
    // Arrange (Hazırlık)
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!'
    }
    const mockApi = vi.fn().mockResolvedValue({ id: 1, ...userData })
    
    // Act (Eylem)
    const result = await createUser(userData, mockApi)
    
    // Assert (Doğrulama)
    expect(result).toEqual({ id: 1, ...userData })
    expect(mockApi).toHaveBeenCalledWith('/users', userData)
  })
})
```

### Mock Kullanımı

```javascript
// API mock'ları
vi.mock('../../services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

// Context mock'ları
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, name: 'Test User' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }))
}))
```

### Test Data Yönetimi

```javascript
// Test data factory'leri
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date().toISOString(),
  ...overrides,
})

// Test data kullanımı
const user = createMockUser({ role: 'admin' })
```

## 🚀 Test Çalıştırma

### Temel Komutlar

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm run test:watch

# Coverage ile testleri çalıştır
npm run test:coverage

# Sadece unit testler
npm run test:unit

# Sadece integration testler
npm run test:integration

# Sadece component testler
npm run test:components

# E2E testler
npm run test:e2e

# Tüm testler (unit + e2e)
npm run test:all
```

### CI/CD Komutları

```bash
# CI için optimize edilmiş testler
npm run test:ci

# Performance testleri
npm run test:performance

# Security testleri
npm run test:security

# Accessibility testleri
npm run test:accessibility
```

### Debug Komutları

```bash
# Debug modunda testler
npm run test:debug

# Test snapshot'larını güncelle
npm run test:update

# Staged dosyalar için testler
npm run test:staged
```

## 📊 Test Raporları

### Coverage Raporu

```bash
npm run test:coverage
```

Coverage raporu şu metrikleri içerir:
- **Statements**: Kod satırları
- **Branches**: Koşul dalları
- **Functions**: Fonksiyonlar
- **Lines**: Satırlar

### E2E Test Raporu

```bash
npm run test:report
```

E2E test raporu şunları içerir:
- Test sonuçları
- Screenshot'lar
- Video kayıtları
- Performance metrikleri

### Performance Raporu

```bash
npm run test:performance
```

Performance raporu şunları içerir:
- Render süreleri
- Memory kullanımı
- Bundle boyutu
- Network performansı

## 🔄 CI/CD Entegrasyonu

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e:headless
      
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
```

### Vercel Integration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "testCommand": "npm run test:ci",
  "installCommand": "npm ci"
}
```

## 🎯 Best Practices

### 1. Test Organizasyonu

```javascript
// Her test dosyası tek bir modülü test etmeli
// src/test/unit/validation.test.js - validation utilities
// src/test/components/LoginForm.test.jsx - LoginForm component
// src/test/integration/auth.test.js - authentication flow
```

### 2. Test İzolasyonu

```javascript
// Her test bağımsız olmalı
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})
```

### 3. Realistic Test Data

```javascript
// Gerçekçi test verileri kullan
const realisticUser = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  phone: '+905551234567',
  tcKimlik: '12345678901'
}
```

### 4. Error Testing

```javascript
// Hata durumlarını test et
it('should handle network errors gracefully', async () => {
  const mockApi = vi.fn().mockRejectedValue(new Error('Network error'))
  
  await expect(createUser(userData, mockApi))
    .rejects.toThrow('Network error')
})
```

### 5. Async Testing

```javascript
// Async işlemleri doğru test et
it('should load user data', async () => {
  renderWithProviders(<UserProfile userId="123" />)
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### 6. Accessibility Testing

```javascript
// Her component için accessibility testi yaz
it('should meet accessibility standards', async () => {
  const { container } = renderWithProviders(<LoginForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 7. Performance Testing

```javascript
// Performance metriklerini test et
it('should render within performance budget', async () => {
  const renderTime = await measureRenderTime(<LargeList items={1000} />)
  expect(renderTime).toBeLessThan(50) // 50ms budget
})
```

## 🐛 Debugging

### Test Debugging

```bash
# Debug modunda test çalıştır
npm run test:debug

# Belirli test dosyasını debug et
npx vitest --inspect-brk src/test/unit/validation.test.js
```

### E2E Debugging

```bash
# Cypress UI'ı aç
npm run test:e2e:open

# Belirli testi debug et
cypress run --spec "cypress/e2e/login.cy.js"
```

### Console Debugging

```javascript
// Test içinde debug
it('should debug test', () => {
  console.log('Debug info:', someVariable)
  debugger // Browser debugger'ı tetikle
})
```

## 📈 Test Metrics

### Coverage Hedefleri

- **Statements**: %90+
- **Branches**: %85+
- **Functions**: %90+
- **Lines**: %90+

### Performance Hedefleri

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Accessibility Hedefleri

- **WCAG 2.1 AA**: %100 compliance
- **Keyboard Navigation**: %100 functional
- **Screen Reader**: %100 compatible

## 🔧 Troubleshooting

### Yaygın Sorunlar

1. **Mock çalışmıyor**
   ```javascript
   // Mock'u doğru import et
   vi.mock('../../utils/validation', () => ({
     validateEmail: vi.fn(() => true)
   }))
   ```

2. **Async test başarısız**
   ```javascript
   // waitFor kullan
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument()
   })
   ```

3. **Component render hatası**
   ```javascript
   // Provider'ları ekle
   renderWithProviders(<Component />)
   ```

### Performance Sorunları

1. **Test çok yavaş**
   ```javascript
   // Mock'ları optimize et
   vi.mock('heavy-library', () => ({
     heavyFunction: vi.fn(() => 'mocked')
   }))
   ```

2. **Memory leak**
   ```javascript
   // Cleanup yap
   afterEach(() => {
     vi.clearAllMocks()
     cleanup()
   })
   ```

## 📚 Kaynaklar

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Accessibility Testing](https://github.com/dequelabs/axe-core)

---

Bu dokümantasyon sürekli güncellenmektedir. Yeni test türleri veya best practice'ler eklendikçe bu dokümantasyon da güncellenecektir.
