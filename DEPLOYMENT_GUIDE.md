# 🚀 PRODUCTION DEPLOYMENT REHBERİ

## 📋 **Genel Bakış**

Bu rehber, Kafkas Derneği Portal projesini production'a deploy etmek için adım adım talimatları içerir.

---

## 🗄️ **Adım 1: Supabase Kurulumu**

### 1.1 Supabase Projesi Oluşturma
1. [supabase.com](https://supabase.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. Proje adı: `kafportal`
5. Database password belirleyin
6. Region seçin (West Europe önerilir)
7. "Create new project" butonuna tıklayın

### 1.2 Proje Bilgilerini Not Edin
```bash
# Bu bilgileri güvenli bir yerde saklayın
Project URL: https://[project-id].supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.3 Veritabanı Tablolarını Oluşturma
Supabase SQL Editor'de aşağıdaki komutları çalıştırın:

```sql
-- Users tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory tablosu
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  unit VARCHAR(50),
  status VARCHAR(50) DEFAULT 'available',
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks tablosu
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aid records tablosu
CREATE TABLE aid_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID,
  aid_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2),
  description TEXT,
  aid_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions tablosu
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 **Adım 2: Güvenlik Ayarları**

### 2.1 Row Level Security (RLS) Etkinleştirme
```sql
-- Tüm tablolar için RLS'yi etkinleştirin
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE aid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
```

### 2.2 Güvenlik Politikaları
```sql
-- Temel politikalar
CREATE POLICY "Anyone can view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can view aid records" ON aid_records FOR SELECT USING (true);
CREATE POLICY "Anyone can view financial transactions" ON financial_transactions FOR SELECT USING (true);
```

---

## 🚀 **Adım 3: Backend Deployment (Railway)**

### 3.1 Railway Hesabı Oluşturma
1. [railway.app](https://railway.app) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. "Deploy from GitHub repo" seçin

### 3.2 Repository Bağlama
1. GitHub repository'nizi seçin
2. "Deploy Now" butonuna tıklayın
3. Root directory: `backend` olarak ayarlayın

### 3.3 Environment Variables Ayarlama
Railway Dashboard'da "Variables" sekmesine gidin ve şu değişkenleri ekleyin:

```env
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-frontend-domain.com
```

### 3.4 Build Ayarları
Railway otomatik olarak TypeScript build'ini yapacaktır. Eğer sorun yaşarsanız:

```json
// package.json'da build script'i kontrol edin
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

## 🌐 **Adım 4: Frontend Deployment (Vercel)**

### 4.1 Vercel Hesabı Oluşturma
1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın

### 4.2 Repository Bağlama
1. GitHub repository'nizi seçin
2. Root directory: `/` (ana dizin) olarak ayarlayın
3. Build command: `npm run build`
4. Output directory: `dist`
5. "Deploy" butonuna tıklayın

### 4.3 Environment Variables Ayarlama
Vercel Dashboard'da "Settings" > "Environment Variables" sekmesine gidin:

```env
VITE_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://your-backend-domain.railway.app
```

---

## 🔗 **Adım 5: Domain ve SSL Ayarları**

### 5.1 Custom Domain Satın Alma
1. Domain sağlayıcısından domain satın alın (örn: kafportal.com)
2. DNS ayarlarını yapın

### 5.2 Vercel Domain Ayarları
1. Vercel Dashboard'da "Settings" > "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin
3. DNS kayıtlarını güncelleyin

### 5.3 Railway Domain Ayarları
1. Railway Dashboard'da "Settings" > "Domains" sekmesine gidin
2. Custom domain'inizi ekleyin (örn: api.kafportal.com)
3. DNS kayıtlarını güncelleyin

---

## 🧪 **Adım 6: Test Etme**

### 6.1 Backend Test
```bash
# Health check
curl https://api.kafportal.com/health

# API endpoint'leri
curl https://api.kafportal.com/api/users
curl https://api.kafportal.com/api/inventory
curl https://api.kafportal.com/api/tasks
curl https://api.kafportal.com/api/aid
curl https://api.kafportal.com/api/finance
```

### 6.2 Frontend Test
1. Tarayıcıda `https://kafportal.com` adresine gidin
2. Tüm sayfaları test edin
3. Form işlemlerini test edin
4. API bağlantılarını test edin

---

## 📊 **Adım 7: Monitoring ve Bakım**

### 7.1 Supabase Monitoring
- Supabase Dashboard'da metrikleri takip edin
- Database performansını izleyin
- Log'ları kontrol edin

### 7.2 Application Monitoring
- Vercel Analytics'i etkinleştirin
- Railway logs'ları takip edin
- Error tracking için Sentry ekleyin

### 7.3 Backup ve Güvenlik
- Supabase'de otomatik backup'ları etkinleştirin
- Environment variables'ları güvenli tutun
- Düzenli güvenlik güncellemeleri yapın

---

## ✅ **Deployment Kontrol Listesi**

### Supabase
- [ ] Proje oluşturuldu
- [ ] Tablolar oluşturuldu
- [ ] RLS ayarları yapıldı
- [ ] Güvenlik politikaları eklendi

### Backend (Railway)
- [ ] Repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Domain ayarlandı
- [ ] SSL sertifikası aktif

### Frontend (Vercel)
- [ ] Repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Domain ayarlandı
- [ ] SSL sertifikası aktif

### Test
- [ ] Backend API'leri test edildi
- [ ] Frontend sayfaları test edildi
- [ ] Form işlemleri test edildi
- [ ] Real-time özellikler test edildi

### Monitoring
- [ ] Analytics etkinleştirildi
- [ ] Error tracking kuruldu
- [ ] Backup sistemi aktif
- [ ] Güvenlik önlemleri kontrol edildi

---

## 🎉 **Tebrikler!**

Projeniz başarıyla production'a deploy edildi. Artık kullanıcılarınız `https://kafportal.com` adresinden uygulamaya erişebilir.

### 📞 **Destek**
Herhangi bir sorun yaşarsanız:
- Supabase: [docs.supabase.com](https://docs.supabase.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
