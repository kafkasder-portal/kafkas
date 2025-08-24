# Kafkas Derneği Portal - Backend API

Node.js + Express.js + TypeScript + PostgreSQL tabanlı backend API servisi.

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya pnpm

### 1. Bağımlılıkları Yükleyin
```bash
npm install
# veya
pnpm install
```

### 2. Ortam Değişkenlerini Ayarlayın
`.env` dosyasını düzenleyin:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kafkasder_portal
DB_USER=postgres
DB_PASSWORD=your_password

# Email Configuration (isteğe bağlı)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. PostgreSQL Veritabanını Hazırlayın
```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanını oluşturun
CREATE DATABASE kafkasder_portal;

# Çıkış yapın
\q
```

### 4. Veritabanı Şemasını Oluşturun
```bash
npm run db:setup
```

### 5. Örnek Verileri Yükleyin (İsteğe Bağlı)
```bash
npm run db:seed
```

## 🏃‍♂️ Çalıştırma

### Geliştirme Modu
```bash
npm run dev
```
API http://localhost:5000 adresinde çalışacaktır.

### Üretim Modu
```bash
npm run build
npm start
```

## 📚 API Endpoints


### Kullanıcı Yönetimi
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Kullanıcı detayı
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil (soft delete)

### Bağış Yönetimi
- `GET /api/donations` - Bağışları listele
- `GET /api/donations/:id` - Bağış detayı
- `POST /api/donations` - Yeni bağış oluştur
- `PUT /api/donations/:id` - Bağış güncelle
- `DELETE /api/donations/:id` - Bağış iptal et

### Yararlanıcı Yönetimi
- `GET /api/beneficiaries` - Yararlanıcıları listele
- `GET /api/beneficiaries/:id` - Yararlanıcı detayı
- `POST /api/beneficiaries` - Yeni yararlanıcı oluştur
- `PUT /api/beneficiaries/:id` - Yararlanıcı güncelle
- `DELETE /api/beneficiaries/:id` - Yararlanıcı deaktive et
- `POST /api/beneficiaries/:id/aid` - Yardım kaydı ekle

### Hastane Sevk Yönetimi
- `GET /api/hospital-referrals` - Sevkleri listele
- `GET /api/hospital-referrals/:id` - Sevk detayı
- `POST /api/hospital-referrals` - Yeni sevk oluştur
- `PUT /api/hospital-referrals/:id` - Sevk güncelle
- `DELETE /api/hospital-referrals/:id` - Sevk iptal et


## 🛡️ Güvenlik

- CORS koruması
- Helmet.js güvenlik başlıkları
- Rate limiting
- Input validation
- SQL injection koruması
- XSS koruması

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Veritabanı bağlantısı
│   ├── controllers/         # İş mantığı kontrolcüleri
│   ├── middleware/
│   ├── models/              # Veri modelleri
│   ├── routes/
│   │   ├── users.ts         # Kullanıcı rotaları
│   │   ├── donations.ts     # Bağış rotaları
│   │   ├── beneficiaries.ts # Yararlanıcı rotaları
│   │   └── hospitalReferrals.ts # Hastane sevk rotaları
│   ├── services/            # İş mantığı servisleri
│   ├── utils/               # Yardımcı fonksiyonlar
│   └── server.ts            # Ana sunucu dosyası
├── database/
│   ├── schema.sql           # Veritabanı şeması
│   └── seed.ts              # Örnek veriler
├── .env                     # Ortam değişkenleri
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Test

```bash
npm test
```

## 📝 Geliştirme Notları

- TypeScript strict mode aktif
- ESLint ve Prettier yapılandırması önerilir
- Veritabanı migration sistemi gelecekte eklenebilir
- API dokümantasyonu için Swagger entegrasyonu planlanıyor

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.