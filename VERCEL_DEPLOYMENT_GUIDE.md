# 🚀 VERCEL FULL-STACK DEPLOYMENT GUIDE

Bu rehber, KAF Portal projesini Vercel'de full-stack olarak deploy etmek için adım adım talimatları içerir.

## 📋 İçindekiler

1. [Vercel Avantajları](#vercel-avantajları)
2. [Proje Hazırlığı](#proje-hazırlığı)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables](#environment-variables)
5. [Domain Ayarları](#domain-ayarları)
6. [Test ve Doğrulama](#test-ve-doğrulama)
7. [Monitoring](#monitoring)

---

## ✅ Vercel Avantajları

### **Tek Platform Avantajları**
- ✅ **Frontend**: React uygulaması
- ✅ **Backend**: Serverless API functions
- ✅ **Database**: Supabase (external)
- ✅ **Domain**: Tek domain altında
- ✅ **SSL**: Otomatik HTTPS
- ✅ **CDN**: Global content delivery
- ✅ **Analytics**: Built-in analytics

### **Maliyet Avantajları**
- **Free Tier**: 100GB bandwidth/ay
- **Pro Plan**: $20/ay (daha fazla kaynak)
- **Enterprise**: Özel fiyatlandırma

### **Teknik Avantajlar**
- **Serverless Functions**: Otomatik ölçeklendirme
- **Edge Functions**: Düşük latency
- **Git Integration**: Otomatik deployment
- **Preview Deployments**: Branch-based testing

---

## 🔧 Proje Hazırlığı

### 1.1 API Functions Yapısı

Projemizde şu API functions bulunuyor:

```
api/
├── health.js              # Health check endpoint
├── users/
│   └── index.js          # Users API
├── inventory/
│   └── index.js          # Inventory API
├── analytics/
│   └── index.js          # Analytics API
└── [diğer API'ler...]
```

### 1.2 Vercel Konfigürasyonu

`vercel.json` dosyası zaten hazır:

```json
{
  "version": 2,
  "name": "kafportal-fullstack",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

---

## 🚀 Vercel Deployment

### 2.1 Vercel Hesabı Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın

### 2.2 Repository Bağlama

1. GitHub repository'nizi seçin: `kafkasder-portal/kafportal`
2. Root directory: `/` (ana dizin) olarak ayarlayın
3. Build command: `npm run build`
4. Output directory: `dist`
5. "Deploy" butonuna tıklayın

### 2.3 Build Ayarları

Vercel otomatik olarak şunları algılayacak:
- **Framework**: Vite (React)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **API Functions**: `api/` klasörü

---

## ⚙️ Environment Variables

### 3.1 Vercel Dashboard'da Ayarlama

Vercel Dashboard'da "Settings" > "Environment Variables" sekmesine gidin:

```bash
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration (Vercel Functions)
VITE_API_URL=https://[your-domain].vercel.app/api

# Frontend Configuration
VITE_APP_NAME=Kafkas Derneği Portal
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MONITORING=true
VITE_ENABLE_ERROR_TRACKING=true

# Analytics Configuration
VITE_ANALYTICS_ENDPOINT=/api/analytics
VITE_HEALTH_ENDPOINT=/api/health
VITE_ANALYTICS_BATCH_SIZE=100
VITE_ANALYTICS_FLUSH_INTERVAL=30000

# Performance Monitoring
VITE_PERFORMANCE_MONITORING=true
VITE_WEB_VITALS_TRACKING=true

# Security
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true

# Real-time Features (Vercel Functions)
VITE_ENABLE_WEBSOCKET=false
VITE_WEBSOCKET_URL=wss://[your-domain].vercel.app

# Internationalization
VITE_DEFAULT_LOCALE=tr
VITE_SUPPORTED_LOCALES=tr,en,ru

# Development/Production Flags
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
VITE_ENABLE_DEBUG=false
```

### 3.2 Environment Variables Açıklamaları

#### **Supabase Variables**
- `VITE_PUBLIC_SUPABASE_URL`: Supabase proje URL'i
- `VITE_PUBLIC_SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (API functions için)

#### **API Variables**
- `VITE_API_URL`: Vercel functions base URL
- `VITE_ANALYTICS_ENDPOINT`: Analytics API endpoint
- `VITE_HEALTH_ENDPOINT`: Health check endpoint

#### **Feature Flags**
- `VITE_ENABLE_ANALYTICS`: Analytics sistemi
- `VITE_ENABLE_MONITORING`: Performance monitoring
- `VITE_ENABLE_PWA`: Progressive Web App

---

## 🔗 Domain Ayarları

### 4.1 Custom Domain

1. Vercel Dashboard'da "Settings" > "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin (örn: kafportal.com)
3. DNS kayıtlarını güncelleyin:

```
Type: A
Name: @
Value: 76.76.19.36

Type: CNAME
Name: www
Value: [your-project].vercel.app
```

### 4.2 SSL Sertifikası

Vercel otomatik olarak SSL sertifikası sağlar. Manuel ayar gerekmez.

---

## 🧪 Test ve Doğrulama

### 5.1 API Endpoint Testleri

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Users API
curl https://your-domain.vercel.app/api/users

# Inventory API
curl https://your-domain.vercel.app/api/inventory

# Analytics API
curl https://your-domain.vercel.app/api/analytics
```

### 5.2 Frontend Test

1. Tarayıcıda `https://your-domain.vercel.app` adresine gidin
2. Tüm sayfaları test edin
3. Form işlemlerini test edin
4. API bağlantılarını test edin

### 5.3 Performance Test

1. Google PageSpeed Insights: `https://pagespeed.web.dev`
2. GTmetrix: `https://gtmetrix.com`
3. WebPageTest: `https://www.webpagetest.org`

---

## 📊 Monitoring

### 6.1 Vercel Analytics

Vercel Dashboard'da "Analytics" sekmesinden:
- Page views
- Performance metrics
- Error tracking
- Real-time monitoring

### 6.2 Custom Monitoring Dashboard

Monitoring dashboard'a `/monitoring-dashboard` adresinden erişebilirsiniz:
- Performance metrikleri (LCP, FID, CLS)
- Analytics verileri
- System health
- Error tracking

### 6.3 Function Logs

Vercel Dashboard'da "Functions" sekmesinden:
- API function logs
- Error tracking
- Performance metrics
- Cold start times

---

## 🔧 Troubleshooting

### 7.1 Yaygın Sorunlar

#### **Build Hatası**
```bash
# package.json'da build script'ini kontrol edin
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### **API Function Hatası**
```bash
# Environment variables'ları kontrol edin
# Supabase bağlantısını test edin
# Function timeout ayarlarını kontrol edin
```

#### **CORS Hatası**
```bash
# API functions'da CORS headers'ı kontrol edin
# Frontend URL'ini doğru ayarlayın
```

### 7.2 Debug Komutları

```bash
# Local development
npm run dev

# Build test
npm run build

# Preview build
npm run preview

# Function test
curl http://localhost:3000/api/health
```

---

## ✅ Deployment Kontrol Listesi

### Vercel Setup
- [ ] Vercel hesabı oluşturuldu
- [ ] Repository bağlandı
- [ ] Build ayarları yapıldı
- [ ] Environment variables ayarlandı

### Supabase
- [ ] Supabase projesi oluşturuldu
- [ ] Tablolar oluşturuldu
- [ ] RLS ayarları yapıldı
- [ ] API keys alındı

### Domain
- [ ] Custom domain eklendi
- [ ] DNS ayarları yapıldı
- [ ] SSL sertifikası aktif

### Test
- [ ] API endpoint'leri test edildi
- [ ] Frontend sayfaları test edildi
- [ ] Form işlemleri test edildi
- [ ] Performance testleri yapıldı

### Monitoring
- [ ] Vercel Analytics etkinleştirildi
- [ ] Custom monitoring dashboard çalışıyor
- [ ] Error tracking aktif

---

## 🎉 Tebrikler!

Projeniz başarıyla Vercel'de full-stack olarak deploy edildi!

### 📊 Erişim Bilgileri

- **Frontend**: `https://your-domain.vercel.app`
- **API**: `https://your-domain.vercel.app/api`
- **Health Check**: `https://your-domain.vercel.app/api/health`
- **Monitoring**: `https://your-domain.vercel.app/monitoring-dashboard`

### 🔄 Sonraki Adımlar

1. **Kullanıcı Eğitimi**: Kullanıcılara sistemi tanıtın
2. **Backup Stratejisi**: Düzenli backup planı oluşturun
3. **Performance Monitoring**: Metrikleri düzenli takip edin
4. **Güvenlik Güncellemeleri**: Düzenli güvenlik kontrolleri yapın
5. **Yeni Özellikler**: Kullanıcı geri bildirimlerine göre geliştirin

---

**Not**: Bu rehber sürekli güncellenmektedir. Yeni özellikler ve iyileştirmeler eklendikçe bu dokümantasyon da güncellenecektir.
