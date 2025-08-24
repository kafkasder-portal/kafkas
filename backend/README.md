# Kafkas Derneği Portal - Backend API

Node.js + Express.js + TypeScript + Supabase tabanlı backend API servisi.

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- Supabase hesabı ve projesi
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

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (isteğe bağlı)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Supabase Projesini Hazırlayın
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Proje URL'sini ve Service Role Key'i `.env` dosyasına ekleyin
4. Gerekli tabloları Supabase Dashboard'dan oluşturun

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

### Envanter Yönetimi
- `GET /api/inventory` - Envanter öğelerini listele
- `GET /api/inventory/:id` - Envanter öğesi detayı
- `POST /api/inventory` - Yeni envanter öğesi oluştur
- `PUT /api/inventory/:id` - Envanter öğesi güncelle
- `DELETE /api/inventory/:id` - Envanter öğesi sil

### Görev Yönetimi
- `GET /api/tasks` - Görevleri listele
- `GET /api/tasks/:id` - Görev detayı
- `POST /api/tasks` - Yeni görev oluştur
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

### Yardım Yönetimi
- `GET /api/aid` - Yardım kayıtlarını listele
- `GET /api/aid/:id` - Yardım kaydı detayı
- `POST /api/aid` - Yeni yardım kaydı oluştur
- `PUT /api/aid/:id` - Yardım kaydı güncelle
- `DELETE /api/aid/:id` - Yardım kaydı sil

## 🛡️ Güvenlik

- CORS koruması
- Helmet.js güvenlik başlıkları
- Rate limiting
- Input validation
- Supabase Row Level Security (RLS)
- XSS koruması

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Supabase bağlantısı
│   ├── routes/
│   │   ├── users.ts         # Kullanıcı rotaları
│   │   ├── inventory.ts     # Envanter rotaları
│   │   ├── tasks.ts         # Görev rotaları
│   │   └── aid.ts           # Yardım rotaları
│   └── server.ts            # Ana sunucu dosyası
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
- Supabase real-time özellikleri kullanılabilir
- API dokümantasyonu için Swagger entegrasyonu planlanıyor

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.