# 🗄️ SUPABASE KURULUM REHBERİ

## 📋 **Adım 1: Supabase Projesi Oluşturma**

### 1.1 Supabase Hesabı Oluşturun
1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın
4. Yeni organizasyon oluşturun

### 1.2 Yeni Proje Oluşturun
1. "New Project" butonuna tıklayın
2. Proje adı: `kafportal` veya `kafkas-dernegi-portal`
3. Database password: Güçlü bir şifre belirleyin
4. Region: En yakın bölgeyi seçin (örn: West Europe)
5. "Create new project" butonuna tıklayın

### 1.3 Proje Bilgilerini Not Edin
Proje oluşturulduktan sonra şu bilgileri not edin:
- **Project URL**: `https://[project-id].supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📊 **Adım 2: Veritabanı Tablolarını Oluşturma**

### 2.1 SQL Editor'ü Açın
1. Supabase Dashboard'da "SQL Editor" sekmesine gidin
2. "New query" butonuna tıklayın

### 2.2 Users Tablosu
```sql
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
```

### 2.3 Inventory Tablosu
```sql
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
```

### 2.4 Tasks Tablosu
```sql
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
```

### 2.5 Aid Records Tablosu
```sql
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
```

### 2.6 Financial Transactions Tablosu
```sql
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

## 🔐 **Adım 3: Row Level Security (RLS) Ayarları**

### 3.1 RLS'yi Etkinleştirin
Her tablo için RLS'yi etkinleştirin:

```sql
-- Users tablosu için
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Inventory tablosu için
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Tasks tablosu için
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Aid records tablosu için
ALTER TABLE aid_records ENABLE ROW LEVEL SECURITY;

-- Financial transactions tablosu için
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
```

### 3.2 Güvenlik Politikaları
```sql
-- Users tablosu için politika
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Inventory tablosu için politika (herkes okuyabilir)
CREATE POLICY "Anyone can view inventory" ON inventory
  FOR SELECT USING (true);

-- Tasks tablosu için politika
CREATE POLICY "Users can view assigned tasks" ON tasks
  FOR SELECT USING (assigned_to::text = auth.uid()::text);

-- Aid records tablosu için politika
CREATE POLICY "Anyone can view aid records" ON aid_records
  FOR SELECT USING (true);

-- Financial transactions tablosu için politika
CREATE POLICY "Anyone can view financial transactions" ON financial_transactions
  FOR SELECT USING (true);
```

---

## ⚙️ **Adım 4: Environment Variables Ayarlama**

### 4.1 Backend (.env dosyası)
```env
# Supabase Configuration
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend URL (production'da güncelleyin)
FRONTEND_URL=https://your-domain.com
```

### 4.2 Frontend (.env dosyası)
```env
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration
VITE_API_URL=https://your-backend-domain.com
```

---

## 🧪 **Adım 5: Test Etme**

### 5.1 Backend Test
```bash
# Backend'i başlatın
cd backend
npm run dev

# API endpoint'lerini test edin
curl http://localhost:5001/health
curl http://localhost:5001/api/users
curl http://localhost:5001/api/inventory
```

### 5.2 Frontend Test
```bash
# Frontend'i başlatın
npm run dev

# Tarayıcıda test edin
http://localhost:5173
```

---

## 🚀 **Adım 6: Production Deployment**

### 6.1 Backend Deployment (Railway/Render)
1. [Railway](https://railway.app) veya [Render](https://render.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables'ları ayarlayın
4. Deploy edin

### 6.2 Frontend Deployment (Vercel/Netlify)
1. [Vercel](https://vercel.com) veya [Netlify](https://netlify.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables'ları ayarlayın
4. Deploy edin

### 6.3 Domain Ayarları
1. Custom domain satın alın
2. DNS ayarlarını yapın
3. SSL sertifikasını ayarlayın

---

## 📊 **Adım 7: Monitoring ve Bakım**

### 7.1 Supabase Monitoring
- Supabase Dashboard'da metrikleri takip edin
- Database performansını izleyin
- Log'ları kontrol edin

### 7.2 Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

---

## ✅ **Kontrol Listesi**

- [ ] Supabase projesi oluşturuldu
- [ ] Tablolar oluşturuldu
- [ ] RLS ayarları yapıldı
- [ ] Environment variables ayarlandı
- [ ] Backend test edildi
- [ ] Frontend test edildi
- [ ] Production deployment yapıldı
- [ ] Domain ayarları yapıldı
- [ ] SSL sertifikası ayarlandı
- [ ] Monitoring kuruldu

---

**Not**: Bu rehberi takip ederek projenizi production'a hazır hale getirebilirsiniz.
