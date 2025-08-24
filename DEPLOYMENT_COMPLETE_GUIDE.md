# 🚀 KAF PORTAL COMPLETE DEPLOYMENT GUIDE

Bu rehber, KAF Portal projesini tamamen production'a deploy etmek için adım adım talimatları içerir.

## 📋 İçindekiler

1. [Supabase Kurulumu](#supabase-kurulumu)
2. [Environment Variables](#environment-variables)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
5. [Domain ve SSL Ayarları](#domain-ve-ssl-ayarları)
6. [Monitoring ve Analytics](#monitoring-ve-analytics)
7. [Test ve Doğrulama](#test-ve-doğrulama)
8. [Bakım ve Güncellemeler](#bakım-ve-güncellemeler)

---

## 🗄️ Supabase Kurulumu

### 1.1 Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. Proje adı: `kafportal`
5. Database password: Güçlü bir şifre belirleyin (not edin!)
6. Region: West Europe (Frankfurt) seçin
7. "Create new project" butonuna tıklayın

### 1.2 Proje Bilgilerini Not Edin

Proje oluşturulduktan sonra şu bilgileri güvenli bir yerde saklayın:

```bash
# Supabase Configuration
Project URL: https://[project-id].supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Database Password: [oluşturduğunuz şifre]
```

### 1.3 Veritabanı Tablolarını Oluşturma

1. Supabase Dashboard'da "SQL Editor" sekmesine gidin
2. "New query" butonuna tıklayın
3. `supabase-setup.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın ve "Run" butonuna tıklayın

### 1.4 Analytics Tablolarını Oluşturma

Analytics için ek tablolar oluşturun:

```sql
-- Analytics events tablosu
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  properties JSONB,
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics tablosu
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  lcp DECIMAL(10,2),
  fid DECIMAL(10,2),
  cls DECIMAL(10,4),
  memory JSONB,
  api_calls JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health reports tablosu
CREATE TABLE IF NOT EXISTS health_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_info JSONB,
  network_info JSONB,
  application_info JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_health_reports_timestamp ON health_reports(timestamp);
```

---

## ⚙️ Environment Variables

### 2.1 Frontend Environment Variables (Vercel)

Vercel Dashboard'da "Settings" > "Environment Variables" sekmesine gidin:

```bash
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API Configuration
VITE_API_URL=https://[your-backend-domain].railway.app/api

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

# Real-time Features
VITE_ENABLE_WEBSOCKET=true
VITE_WEBSOCKET_URL=wss://[your-backend-domain].railway.app

# Internationalization
VITE_DEFAULT_LOCALE=tr
VITE_SUPPORTED_LOCALES=tr,en,ru

# Development/Production Flags
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
VITE_ENABLE_DEBUG=false
```

### 2.2 Backend Environment Variables (Railway)

Railway Dashboard'da "Variables" sekmesine gidin:

```bash
# Supabase Configuration
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=5001
NODE_ENV=production
HOST=0.0.0.0

# Frontend URL (CORS için)
FRONTEND_URL=https://[your-frontend-domain].vercel.app
ALLOWED_ORIGINS=https://[your-frontend-domain].vercel.app,https://www.[your-frontend-domain].vercel.app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring Configuration
ENABLE_MONITORING=true
MONITORING_INTERVAL=30000

# WebSocket Configuration
ENABLE_WEBSOCKET=true
WEBSOCKET_PORT=5002

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Development/Production Flags
ENABLE_LOGGING=true
ENABLE_DEBUG=false
ENABLE_SWAGGER=false
```

---

## 🌐 Frontend Deployment (Vercel)

### 3.1 Vercel Hesabı Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın

### 3.2 Repository Bağlama

1. GitHub repository'nizi seçin
2. Root directory: `/` (ana dizin) olarak ayarlayın
3. Build command: `npm run build`
4. Output directory: `dist`
5. "Deploy" butonuna tıklayın

### 3.3 Environment Variables Ayarlama

Vercel Dashboard'da "Settings" > "Environment Variables" sekmesine gidin ve yukarıdaki frontend environment variables'ları ekleyin.

### 3.4 Build Ayarları

`vercel.json` dosyası zaten hazır. Eğer sorun yaşarsanız:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

---

## 🔧 Backend Deployment (Railway)

### 4.1 Railway Hesabı Oluşturma

1. [railway.app](https://railway.app) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. "Deploy from GitHub repo" seçin

### 4.2 Repository Bağlama

1. GitHub repository'nizi seçin
2. Root directory: `backend` olarak ayarlayın
3. "Deploy Now" butonuna tıklayın

### 4.3 Environment Variables Ayarlama

Railway Dashboard'da "Variables" sekmesine gidin ve yukarıdaki backend environment variables'ları ekleyin.

### 4.4 Build Ayarları

Railway otomatik olarak TypeScript build'ini yapacaktır. `railway.json` dosyası zaten hazır.

---

## 🔗 Domain ve SSL Ayarları

### 5.1 Custom Domain Satın Alma

1. Domain sağlayıcısından domain satın alın (örn: kafportal.com)
2. DNS ayarlarını yapın

### 5.2 Vercel Domain Ayarları

1. Vercel Dashboard'da "Settings" > "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin
3. DNS kayıtlarını güncelleyin:
   ```
   Type: A
   Name: @
   Value: 76.76.19.36
   
   Type: CNAME
   Name: www
   Value: [your-project].vercel.app
   ```

### 5.3 Railway Domain Ayarları

1. Railway Dashboard'da "Settings" > "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin (örn: api.kafportal.com)
3. DNS kayıtlarını güncelleyin:
   ```
   Type: CNAME
   Name: api
   Value: [your-railway-domain].railway.app
   ```

### 5.4 SSL Sertifikası

Vercel ve Railway otomatik olarak SSL sertifikası sağlar. Manuel ayar gerekmez.

---

## 📊 Monitoring ve Analytics

### 6.1 Google Analytics Kurulumu

1. [analytics.google.com](https://analytics.google.com) adresine gidin
2. Yeni hesap oluşturun
3. Property oluşturun
4. Measurement ID'yi alın (G-XXXXXXXXXX)
5. Environment variable'a ekleyin: `VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX`

### 6.2 Sentry Error Tracking

1. [sentry.io](https://sentry.io) adresine gidin
2. Yeni proje oluşturun
3. DSN'yi alın
4. Environment variable'a ekleyin: `VITE_SENTRY_DSN=https://your-dsn.ingest.sentry.io/xxxxx`

### 6.3 Performance Monitoring

Monitoring sistemi zaten kurulu. Dashboard'a `/monitoring-dashboard` adresinden erişebilirsiniz.

### 6.4 Uptime Monitoring

1. [uptimerobot.com](https://uptimerobot.com) adresine gidin
2. Yeni monitor oluşturun
3. URL: `https://kafportal.com`
4. Check interval: 5 minutes

---

## 🧪 Test ve Doğrulama

### 7.1 Backend Test

```bash
# Health check
curl https://api.kafportal.com/health

# API endpoint'leri
curl https://api.kafportal.com/api/users
curl https://api.kafportal.com/api/inventory
curl https://api.kafportal.com/api/tasks
curl https://api.kafportal.com/api/aid
curl https://api.kafportal.com/api/finance

# Analytics endpoint'leri
curl https://api.kafportal.com/api/analytics/summary
curl https://api.kafportal.com/api/analytics/metrics
```

### 7.2 Frontend Test

1. Tarayıcıda `https://kafportal.com` adresine gidin
2. Tüm sayfaları test edin
3. Form işlemlerini test edin
4. API bağlantılarını test edin
5. Real-time özellikleri test edin

### 7.3 Performance Test

1. Google PageSpeed Insights: `https://pagespeed.web.dev`
2. GTmetrix: `https://gtmetrix.com`
3. WebPageTest: `https://www.webpagetest.org`

### 7.4 Security Test

1. SSL Labs: `https://www.ssllabs.com/ssltest`
2. Security Headers: `https://securityheaders.com`
3. Mozilla Observatory: `https://observatory.mozilla.org`

---

## 🔧 Bakım ve Güncellemeler

### 8.1 Düzenli Bakım

- **Günlük**: Log'ları kontrol edin
- **Haftalık**: Performance metriklerini inceleyin
- **Aylık**: Security güncellemelerini yapın
- **Üç aylık**: Backup'ları test edin

### 8.2 Monitoring Dashboard

Monitoring dashboard'a `/monitoring-dashboard` adresinden erişebilirsiniz:

- Performance metrikleri
- Analytics verileri
- System health
- Error tracking

### 8.3 Backup Stratejisi

1. **Supabase**: Otomatik backup (günlük)
2. **Code**: GitHub repository
3. **Environment Variables**: Güvenli not alma
4. **Files**: Cloud storage (AWS S3, Google Cloud Storage)

### 8.4 Güncelleme Süreci

1. Development branch'te değişiklikleri test edin
2. Pull request oluşturun
3. Code review yapın
4. Main branch'e merge edin
5. Otomatik deployment'ı bekleyin
6. Production'da test edin

---

## ✅ Deployment Kontrol Listesi

### Supabase
- [ ] Proje oluşturuldu
- [ ] Tablolar oluşturuldu
- [ ] RLS ayarları yapıldı
- [ ] Analytics tabloları oluşturuldu
- [ ] Güvenlik politikaları eklendi

### Frontend (Vercel)
- [ ] Repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Domain ayarlandı
- [ ] SSL sertifikası aktif

### Backend (Railway)
- [ ] Repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Domain ayarlandı
- [ ] SSL sertifikası aktif

### Monitoring
- [ ] Google Analytics kuruldu
- [ ] Sentry error tracking kuruldu
- [ ] Performance monitoring aktif
- [ ] Uptime monitoring kuruldu

### Test
- [ ] Backend API'leri test edildi
- [ ] Frontend sayfaları test edildi
- [ ] Form işlemleri test edildi
- [ ] Real-time özellikler test edildi
- [ ] Performance testleri yapıldı
- [ ] Security testleri yapıldı

---

## 🎉 Tebrikler!

Projeniz başarıyla production'a deploy edildi. Artık kullanıcılarınız `https://kafportal.com` adresinden uygulamaya erişebilir.

### 📞 Destek

Herhangi bir sorun yaşarsanız:

- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Monitoring**: `/monitoring-dashboard` adresinden erişebilirsiniz

### 🔄 Sonraki Adımlar

1. Kullanıcı eğitimi yapın
2. Düzenli backup'ları kontrol edin
3. Performance metriklerini izleyin
4. Kullanıcı geri bildirimlerini toplayın
5. Yeni özellikler planlayın

---

**Not**: Bu rehber sürekli güncellenmektedir. Yeni özellikler ve iyileştirmeler eklendikçe bu dokümantasyon da güncellenecektir.
