# 🗺️ KAF PORTAL - DETAYLI UYGULAMA HARİTASI

## 📋 İÇİNDEKİLER
1. [Proje Genel Bakış](#proje-genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Mimari Yapı](#mimari-yapı)
4. [Veritabanı Şeması](#veritabanı-şeması)
5. [Sayfa ve Modül Analizi](#sayfa-ve-modül-analizi)
6. [Component Yapısı](#component-yapısı)
7. [Servis Katmanı](#servis-katmanı)
8. [Güvenlik ve Yetkilendirme](#güvenlik-ve-yetkilendirme)
9. [Çoklu Dil Desteği](#çoklu-dil-desteği)
10. [Performans Optimizasyonları](#performans-optimizasyonları)
11. [Deployment ve CI/CD](#deployment-ve-cicd)
12. [Test Stratejisi](#test-stratejisi)
13. [Monitoring ve Analytics](#monitoring-ve-analytics)
14. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## 🎯 PROJE GENEL BAKIŞ

### Proje Adı
**KAF Portal** - Kardeşlik ve Yardımlaşma Portalı

### Amaç
NGO (Sivil Toplum Kuruluşu) yönetim sistemi olarak tasarlanmış, bağış yönetimi, gönüllü koordinasyonu, finansal takip ve yardım dağıtımı gibi temel işlevleri kapsayan kapsamlı bir web uygulaması.

### Hedef Kullanıcılar
- **Admin**: Sistem yöneticileri
- **Manager**: Yöneticiler
- **Coordinator**: Koordinatörler
- **Volunteer**: Gönüllüler
- **Viewer**: Görüntüleyiciler

---

## 🛠️ TEKNOLOJİ STACK

### Frontend
- **React 18.3.1** - Ana UI framework
- **Vite 7.1.2** - Build tool ve dev server
- **React Router DOM 6.30.1** - Routing
- **Framer Motion 12.23.12** - Animasyonlar
- **Lucide React 0.330.0** - İkonlar
- **Sonner 1.4.0** - Toast bildirimleri

### Backend & Database
- **Supabase 2.56.0** - Backend as a Service
- **PostgreSQL** - Ana veritabanı
- **Express 5.1.0** - API server (fallback)

### State Management & Context
- **React Context API** - Global state yönetimi
- **Custom Hooks** - Local state yönetimi

### Internationalization
- **i18next 23.10.0** - Çoklu dil desteği
- **react-i18next 14.1.0** - React entegrasyonu

### Development Tools
- **ESLint 9.34.0** - Code linting
- **Prettier 3.2.5** - Code formatting
- **Vitest 3.2.4** - Testing framework
- **TypeScript** - Type safety (kısmi)

---

## 🏗️ MİMARİ YAPI

### Dosya Yapısı
```
src/
├── components/          # UI Bileşenleri
│   ├── forms/          # Form bileşenleri
│   ├── tables/         # Tablo bileşenleri
│   ├── modals/         # Modal bileşenleri
│   └── ui/             # Temel UI bileşenleri
├── pages/              # Sayfa bileşenleri
├── services/           # API servisleri
├── hooks/              # Custom hooks
├── contexts/           # React contexts
├── utils/              # Yardımcı fonksiyonlar
├── i18n/               # Çoklu dil desteği
├── lib/                # Kütüphane konfigürasyonları
└── styles/             # CSS stilleri
```

### Mimari Prensipler
1. **Component-Based Architecture** - Yeniden kullanılabilir bileşenler
2. **Service Layer Pattern** - API işlemleri için ayrı katman
3. **Context Pattern** - Global state yönetimi
4. **Custom Hooks** - Logic separation
5. **Lazy Loading** - Performance optimization

---

## 🗄️ VERİTABANI ŞEMASI

### Ana Tablolar

#### 1. Users (Kullanıcılar)
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- role (ENUM: admin, manager, user, volunteer)
- status (ENUM: active, inactive, suspended)
- phone (VARCHAR)
- address (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. Inventory (Envanter)
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- quantity (INTEGER)
- unit (VARCHAR)
- status (ENUM: available, low_stock, out_of_stock)
- location (VARCHAR)
- min_quantity (INTEGER)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. Tasks (Görevler)
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- status (ENUM: pending, in_progress, completed, cancelled)
- priority (ENUM: low, medium, high, urgent)
- assigned_to (UUID, Foreign Key)
- assigned_by (UUID, Foreign Key)
- due_date (TIMESTAMP)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. Beneficiaries (İhtiyaç Sahipleri)
```sql
- id (UUID, Primary Key)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- family_size (INTEGER)
- income_level (VARCHAR)
- status (ENUM: active, inactive, archived)
- notes (TEXT)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. Financial Transactions (Finansal İşlemler)
```sql
- id (UUID, Primary Key)
- type (ENUM: income, expense)
- category (VARCHAR)
- amount (DECIMAL)
- description (TEXT)
- reference (VARCHAR)
- status (ENUM: pending, approved, completed, cancelled)
- transaction_date (TIMESTAMP)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 6. Donations (Bağışlar)
```sql
- id (UUID, Primary Key)
- donor_name (VARCHAR)
- donor_email (VARCHAR)
- donor_phone (VARCHAR)
- amount (DECIMAL)
- currency (VARCHAR, Default: TRY)
- payment_method (VARCHAR)
- status (ENUM: pending, completed, failed, refunded)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 7. Volunteers (Gönüllüler)
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- skills (TEXT[])
- availability (TEXT)
- status (ENUM: active, inactive, pending)
- join_date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 8. Meetings (Toplantılar)
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- meeting_date (TIMESTAMP)
- duration (INTEGER)
- location (VARCHAR)
- meeting_type (ENUM: board, committee, general, volunteer)
- status (ENUM: scheduled, in_progress, completed, cancelled)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 9. Messages (Mesajlar)
```sql
- id (UUID, Primary Key)
- sender_id (UUID, Foreign Key)
- recipient_id (UUID, Foreign Key)
- subject (VARCHAR)
- content (TEXT)
- is_read (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 10. Scholarships (Burslar)
```sql
- id (UUID, Primary Key)
- student_name (VARCHAR)
- student_email (VARCHAR)
- amount (DECIMAL)
- academic_year (VARCHAR)
- status (ENUM: pending, approved, paid, rejected)
- notes (TEXT)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 11. Hospital Referrals (Hastane Sevkleri)
```sql
- id (UUID, Primary Key)
- patient_name (VARCHAR)
- patient_phone (VARCHAR)
- hospital_name (VARCHAR)
- department (VARCHAR)
- referral_date (TIMESTAMP)
- status (ENUM: pending, approved, completed, cancelled)
- notes (TEXT)
- created_by (UUID, Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Güvenlik Özellikleri
- **Row Level Security (RLS)** - Tüm tablolarda aktif
- **Role-based Access Control** - Kullanıcı rolleri
- **Authentication** - JWT token tabanlı
- **Authorization** - Permission-based access

---

## 📄 SAYFA VE MODÜL ANALİZİ

### 1. Dashboard (Ana Sayfa)
**Dosya**: `src/pages/Dashboard.jsx`
**Amaç**: Sistem genel bakışı ve özet bilgiler
**Özellikler**:
- Aylık bağış trendi grafiği
- Aylık karşılaştırma grafiği
- AI önerileri
- Gerçek zamanlı işbirliği
- Hızlı işlemler
- Yaklaşan görevler

**Kullanılan Servisler**:
- `donationsService.getDonationStats()`
- `beneficiariesService.getBeneficiaryStats()`
- `hospitalReferralsService.getReferralStats()`

### 2. User Management (Kullanıcı Yönetimi)
**Dosya**: `src/pages/UserManagement.jsx`
**Amaç**: Kullanıcı hesaplarının yönetimi
**Özellikler**:
- Kullanıcı listesi görüntüleme
- Yeni kullanıcı ekleme
- Kullanıcı düzenleme
- Kullanıcı deaktif etme
- Rol tabanlı filtreleme
- Arama fonksiyonu

**Form Validasyonları**:
- Kullanıcı adı benzersizlik kontrolü
- E-posta format kontrolü
- Şifre zorunluluğu (yeni kullanıcılar için)
- Ad soyad zorunluluğu

### 3. Donations (Bağış Yönetimi)
**Dosya**: `src/pages/Donations.jsx`
**Amaç**: Bağış kayıtlarının yönetimi
**Özellikler**:
- Bağış listesi görüntüleme
- Bağış arama ve filtreleme
- Bağış durumu takibi
- Para birimi formatlaması
- Tarih formatlaması

**Alt Modüller**:
- Bağış Listesi
- Bağış Veznesi
- Kurumlar
- Kumbara Takibi

### 4. Inventory (Envanter)
**Dosya**: `src/pages/Inventory.jsx`
**Amaç**: Stok yönetimi
**Özellikler**:
- Ürün listesi görüntüleme
- Stok ekleme/çıkarma
- Kategori bazlı filtreleme
- Düşük stok uyarıları
- Ürün güncelleme

**Stok Durumları**:
- Available (Mevcut)
- Low Stock (Düşük Stok)
- Out of Stock (Stok Yok)
- Discontinued (Üretimden Kaldırılmış)

### 5. Finance (Finans)
**Dosya**: `src/pages/Finance.jsx`
**Amaç**: Finansal işlemlerin yönetimi
**Özellikler**:
- Gelir/gider takibi
- Finansal istatistikler
- İşlem kategorileri
- Raporlama
- Bütçe yönetimi

**İstatistikler**:
- Toplam Gelir
- Toplam Gider
- Net Bakiye
- Aylık Bütçe

### 6. Beneficiaries (İhtiyaç Sahipleri)
**Dosya**: `src/pages/Beneficiaries.jsx`
**Amaç**: Yardım alan kişilerin yönetimi
**Özellikler**:
- İhtiyaç sahibi listesi
- Detaylı profil görüntüleme
- Aile büyüklüğü takibi
- Gelir seviyesi kategorileri
- Yardım geçmişi

### 7. Volunteers (Gönüllüler)
**Dosya**: `src/pages/Volunteers.jsx`
**Amaç**: Gönüllü koordinasyonu
**Özellikler**:
- Gönüllü listesi
- Beceri yönetimi
- Müsaitlik takibi
- Gönüllü raporları

### 8. Tasks (Görevler)
**Dosya**: `src/pages/Tasks.jsx`
**Amaç**: Görev yönetimi
**Özellikler**:
- Görev listesi
- Görev atama
- Öncelik seviyeleri
- Deadline takibi
- Görev takvimi

### 9. Messages (Mesajlar)
**Dosya**: `src/pages/Messages.jsx`
**Amaç**: İç mesajlaşma sistemi
**Özellikler**:
- Mesaj listesi
- Okundu/okunmadı durumu
- Mesaj gönderme
- SMS/Email entegrasyonu

### 10. System (Sistem)
**Dosya**: `src/pages/System.jsx`
**Amaç**: Sistem yönetimi
**Özellikler**:
- Sistem ayarları
- Hata takibi
- Kullanıcı yönetimi
- IP engelleme

---

## 🧩 COMPONENT YAPISI

### Core Components

#### 1. ProtectedRoute
**Dosya**: `src/components/ProtectedRoute.jsx`
**Amaç**: Yetkilendirme kontrolü
**Özellikler**:
- Role-based access control
- Permission-based access
- Redirect logic

#### 2. Sidebar
**Dosya**: `src/components/Sidebar.jsx`
**Amaç**: Ana navigasyon menüsü
**Özellikler**:
- Collapsible sidebar
- Hover popup menüler
- Role-based menu filtering
- Responsive design

#### 3. ErrorBoundary
**Dosya**: `src/components/ErrorBoundary.jsx`
**Amaç**: Hata yakalama ve gösterme
**Özellikler**:
- React error boundary
- Error logging
- User-friendly error messages

#### 4. ToastNotification
**Dosya**: `src/components/ToastNotification.jsx`
**Amaç**: Bildirim sistemi
**Özellikler**:
- Success/Error/Warning bildirimleri
- Auto-dismiss
- Manual dismiss

### UI Components

#### 1. DataVisualization
**Dosya**: `src/components/DataVisualization.jsx`
**Amaç**: Grafik ve chart bileşenleri
**Özellikler**:
- LineChart
- BarChart
- PieChart
- ChartContainer

#### 2. OptimizedTable
**Dosya**: `src/components/OptimizedTable.jsx`
**Amaç**: Performanslı tablo bileşeni
**Özellikler**:
- Virtual scrolling
- Sorting
- Filtering
- Pagination

#### 3. SecureForm
**Dosya**: `src/components/SecureForm.jsx`
**Amaç**: Güvenli form bileşeni
**Özellikler**:
- Input sanitization
- XSS protection
- Validation
- Error handling

### Advanced Components

#### 1. AISuggestions
**Dosya**: `src/components/AISuggestions.jsx`
**Amaç**: AI destekli öneriler
**Özellikler**:
- Context-aware suggestions
- Learning from user behavior
- Performance optimization tips

#### 2. RealTimeCollaboration
**Dosya**: `src/components/RealTimeCollaboration.jsx`
**Amaç**: Gerçek zamanlı işbirliği
**Özellikler**:
- WebSocket connection
- Live updates
- User presence
- Activity feed

#### 3. PerformanceDashboard
**Dosya**: `src/components/PerformanceDashboard.jsx`
**Amaç**: Performans izleme
**Özellikler**:
- System metrics
- User activity tracking
- Performance alerts
- Optimization suggestions

---

## 🔧 SERVİS KATMANI

### Base Service
**Dosya**: `src/services/BaseService.js`
**Amaç**: Temel API işlemleri
**Özellikler**:
- CRUD operations
- Error handling
- Retry logic
- Authentication

### Service Listesi

#### 1. AuthService
**Dosya**: `src/services/authService.js`
**Özellikler**:
- Login/Logout
- User management
- Role management
- Permission checking

#### 2. DonationsService
**Dosya**: `src/services/donationsService.js`
**Özellikler**:
- Donation CRUD
- Statistics
- Reporting
- Export functionality

#### 3. InventoryService
**Dosya**: `src/services/inventoryService.js`
**Özellikler**:
- Item management
- Stock operations
- Category management
- Low stock alerts

#### 4. FinanceService
**Dosya**: `src/services/financeService.js`
**Özellikler**:
- Transaction management
- Financial reporting
- Budget tracking
- Export to Excel

#### 5. BeneficiariesService
**Dosya**: `src/services/beneficiariesService.js`
**Özellikler**:
- Beneficiary CRUD
- Aid history
- Family management
- Statistics

#### 6. VolunteersService
**Dosya**: `src/services/volunteersService.js`
**Özellikler**:
- Volunteer management
- Skill tracking
- Availability management
- Performance reports

#### 7. TasksService
**Dosya**: `src/services/tasksService.js`
**Özellikler**:
- Task CRUD
- Assignment management
- Deadline tracking
- Progress monitoring

#### 8. MessagesService
**Dosya**: `src/services/messagesService.js`
**Özellikler**:
- Message CRUD
- Read status
- Notification system
- Email/SMS integration

### Mock API Client
**Dosya**: `src/services/mockApiClient.js`
**Amaç**: Development için mock data
**Özellikler**:
- Realistic mock data
- Simulated delays
- Error simulation
- Offline support

---

## 🔐 GÜVENLİK VE YETKİLENDİRME

### Authentication System
- **JWT Token** tabanlı authentication
- **Supabase Auth** entegrasyonu
- **Fallback authentication** (development)
- **Session management**
- **Auto-refresh tokens**

### Authorization System
- **Role-based Access Control (RBAC)**
- **Permission-based Access Control**
- **Row Level Security (RLS)**
- **API endpoint protection**

### Security Features
- **Input sanitization** (DOMPurify)
- **XSS protection**
- **CSRF protection**
- **Content Security Policy (CSP)**
- **Secure headers**

### User Roles
1. **Admin** - Tam sistem erişimi
2. **Manager** - Yönetim yetkileri
3. **Coordinator** - Koordinasyon yetkileri
4. **Volunteer** - Gönüllü yetkileri
5. **Viewer** - Sadece görüntüleme

---

## 🌍 ÇOKLU DİL DESTEĞİ

### Desteklenen Diller
- **Türkçe (tr)** - Ana dil
- **İngilizce (en)** - İkinci dil
- **Rusça (ru)** - Üçüncü dil

### Dil Dosyaları
- `src/i18n/locales/tr.json` - Türkçe çeviriler
- `src/i18n/locales/en.json` - İngilizce çeviriler
- `src/i18n/locales/ru.json` - Rusça çeviriler

### Çeviri Kategorileri
- **common** - Genel terimler
- **navigation** - Navigasyon menüleri
- **dashboard** - Dashboard sayfası
- **notifications** - Bildirimler
- **auth** - Kimlik doğrulama
- **roles** - Kullanıcı rolleri
- **status** - Durum terimleri
- **forms** - Form validasyonları
- **errors** - Hata mesajları

### Dil Değiştirme
- **LanguageSwitcher** component
- **Browser language detection**
- **Persistent language preference**
- **Dynamic translation loading**

---

## ⚡ PERFORMANS OPTİMİZASYONLARI

### Code Splitting
- **Route-based splitting** - Her sayfa ayrı bundle
- **Component-based splitting** - Büyük componentler lazy load
- **Dynamic imports** - İhtiyaç anında yükleme

### Bundle Optimization
- **Tree shaking** - Kullanılmayan kodları temizleme
- **Minification** - Kod sıkıştırma
- **Gzip compression** - Dosya boyutu küçültme
- **Bundle analysis** - Boyut analizi

### Image Optimization
- **WebP format** - Modern format desteği
- **Lazy loading** - Görünür olunca yükleme
- **Responsive images** - Cihaza uygun boyutlar
- **OptimizedImage component** - Otomatik optimizasyon

### Caching Strategy
- **Service Worker** - Offline support
- **Runtime caching** - API response caching
- **Static caching** - Asset caching
- **Cache invalidation** - Version-based

### React Optimizations
- **React.memo** - Component memoization
- **useMemo** - Expensive calculation caching
- **useCallback** - Function memoization
- **Virtual scrolling** - Büyük listeler için

---

## 🚀 DEPLOYMENT VE CI/CD

### Build Process
- **Vite build** - Production build
- **Environment variables** - Config management
- **Asset optimization** - Image/font optimization
- **Source maps** - Development only

### Deployment Platforms
- **Vercel** - Frontend hosting
- **Supabase** - Backend hosting
- **Railway** - Alternative backend
- **Render** - Alternative hosting

### Environment Configuration
- **Development** - Local development
- **Staging** - Pre-production testing
- **Production** - Live environment

### CI/CD Pipeline
- **GitHub Actions** - Automated deployment
- **Build testing** - Automated testing
- **Deployment scripts** - Automated deployment
- **Health checks** - Post-deployment verification

---

## 🧪 TEST STRATEJİSİ

### Testing Framework
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **Coverage reporting** - Test coverage

### Test Types
1. **Unit Tests** - Individual function testing
2. **Component Tests** - React component testing
3. **Integration Tests** - Service integration testing
4. **E2E Tests** - Full user flow testing

### Test Coverage
- **Components** - UI component testing
- **Services** - API service testing
- **Utils** - Utility function testing
- **Hooks** - Custom hook testing

### Testing Tools
- **Mock API** - API simulation
- **Test data** - Realistic test data
- **Test utilities** - Helper functions
- **Performance testing** - Load testing

---

## 📊 MONITORING VE ANALYTICS

### Performance Monitoring
- **Core Web Vitals** - LCP, FID, CLS
- **Bundle analysis** - Size monitoring
- **Error tracking** - Error monitoring
- **User analytics** - Usage tracking

### Real-time Monitoring
- **WebSocket status** - Connection health
- **API performance** - Response times
- **Database queries** - Query performance
- **User sessions** - Active users

### Analytics Features
- **User behavior** - Click tracking
- **Page views** - Navigation tracking
- **Feature usage** - Function usage
- **Performance metrics** - Speed tracking

### Error Tracking
- **Console errors** - JavaScript errors
- **API errors** - Backend errors
- **Network errors** - Connection issues
- **User feedback** - Error reports

---

## 🔮 GELECEK GELİŞTİRMELER

### Kısa Vadeli (1-3 ay)
1. **Mobile App** - React Native uygulaması
2. **Advanced Reporting** - Detaylı raporlama sistemi
3. **Email Integration** - Gelişmiş email sistemi
4. **Document Management** - Dosya yönetimi

### Orta Vadeli (3-6 ay)
1. **AI Integration** - Yapay zeka özellikleri
2. **Workflow Automation** - İş akışı otomasyonu
3. **Advanced Analytics** - Gelişmiş analitik
4. **Multi-tenant Support** - Çoklu organizasyon desteği

### Uzun Vadeli (6+ ay)
1. **Blockchain Integration** - Şeffaflık için blockchain
2. **IoT Integration** - Sensör entegrasyonu
3. **Machine Learning** - Tahmin modelleri
4. **Global Expansion** - Uluslararası genişleme

### Teknik İyileştirmeler
1. **TypeScript Migration** - Tam TypeScript desteği
2. **Microservices** - Servis mimarisi
3. **GraphQL** - API optimizasyonu
4. **PWA Features** - Progressive Web App

---

## 📈 PERFORMANS METRİKLERİ

### Frontend Metrics
- **Bundle Size**: < 500KB
- **Load Time**: < 3 seconds
- **TTI (Time to Interactive)**: < 5 seconds
- **FCP (First Contentful Paint)**: < 2 seconds

### Backend Metrics
- **API Response Time**: < 200ms
- **Database Query Time**: < 100ms
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%

### User Experience Metrics
- **Page Load Speed**: < 2 seconds
- **Navigation Speed**: < 1 second
- **Form Submission**: < 500ms
- **Search Response**: < 300ms

---

## 🎯 SONUÇ

KAF Portal, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir NGO yönetim sistemidir. Sistem, kullanıcı dostu arayüzü, güçlü backend altyapısı ve gelişmiş güvenlik özellikleri ile profesyonel bir çözüm sunmaktadır.

### Güçlü Yönler
- ✅ Modern teknoloji stack
- ✅ Responsive design
- ✅ Çoklu dil desteği
- ✅ Güvenli authentication
- ✅ Performans optimizasyonları
- ✅ Kapsamlı test coverage
- ✅ Scalable architecture

### Geliştirme Alanları
- 🔄 TypeScript migration
- 🔄 Advanced AI features
- 🔄 Mobile app development
- 🔄 Blockchain integration
- 🔄 Microservices architecture

Bu harita, KAF Portal'ın mevcut durumunu ve gelecek vizyonunu kapsamlı bir şekilde ortaya koymaktadır. Sistem, sürekli geliştirme ve iyileştirme prensibi ile tasarlanmış olup, gelecekteki ihtiyaçlara uyum sağlayabilecek esnek bir yapıya sahiptir.
