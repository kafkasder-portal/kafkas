# 🏛️ Kafkas Derneği Portal - Modern NGO Yönetim Sistemi

Modern, responsive ve kullanıcı dostu dernek yönetim sistemi. React 18 ve Vite ile geliştirilmiş, enterprise seviye özellikler içeren kapsamlı bir portal.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-purple?logo=vite)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.0.28-pink?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green)](#lisans)

## 📋 Proje Hakkında

Kafkas Derneği Portal, sivil toplum kuruluşları için geliştirilmiş kapsamlı bir yönetim sistemidir. Bu sistem, dernek faaliyetlerinin dijital ortamda etkin bir şekilde yönetilmesini sağlar ve modern teknolojilerle güçlendirilmiş enterprise seviye özellikler sunar.

## ✨ Ana Özellikler

### 📊 **Yönetim Modülleri**

- **Dashboard** - Genel bakış ve istatistikler
- **Bağış Yönetimi** - Bağış takibi ve raporlama
- **Gönüllü Yönetimi** - Gönüllü kaydı ve görev ataması
- **Yardım Yönetimi** - Yardım programları ve hastane sevk sistemi
- **Mali Yönetim** - Muhasebe ve finansal raporlar
- **Envanter Yönetimi** - Stok takibi ve malzeme yönetimi
- **Toplantı Yönetimi** - Toplantı planlama ve takip
- **Sistem Yönetimi** - Kullanıcı yönetimi ve güvenlik

### 🏥 **Hastane Sevk Sistemi**

- **Hasta Bilgileri Yönetimi** - TC kimlik, yaş, cinsiyet, adres bilgileri
- **Tıbbi Bilgiler** - Tanı, aciliyet seviyesi, hastane ve bölüm bilgileri
- **Aciliyet Seviyelerine Göre Önceliklendirme** - Yüksek, orta, düşük aciliyet
- **Maliyet Hesaplaması** - Tedavi maliyeti ve ödeme durumu takibi
- **Ulaşım İhtiyacı Kontrolü** - Ambulans gereksinimi yönetimi
- **Onay Süreçleri** - Sevk onaylama ve reddetme işlemleri

### 📈 **Enterprise Analytics & Automation**

- **Gelişmiş Analytics Dashboard** - Trend analizi, performans metrikleri, heatmap takvimi
- **Real-time Dashboard** - Canlı sistem monitoring, WebSocket simülasyonu
- **Workflow Automation** - İş süreçlerini otomatikleştirme, drag & drop builder
- **Report Generator** - Özelleştirilebilir raporlar ve export özellikleri
- **Theme Customizer** - Gelişmiş tema özelleştirme sistemi
- **Dynamic Form Builder** - Drag & drop form oluşturucu

### 🎨 **UI/UX Özellikleri**

- **Responsive Design** - Tüm cihazlarda uyumlu
- **Dark/Light Mode** - Tema değiştirme desteği
- **Smooth Animations** - Framer Motion ile zengin animasyonlar
- **Interactive Components** - Kullanıcı dostu arayüz
- **Multi-language Support** - Türkçe ve Rusça dil desteği
- **Mobile Navigation** - Mobil optimized navigasyon

## 🛠️ Teknoloji Stack

### **Frontend**

- **React 18.3.1** - Modern UI framework
- **Vite 7.1.3** - Hızlı build tool
- **Framer Motion 11.0.28** - Advanced animations
- **React Router 7.0.2** - Client-side routing
- **Lucide React** - Modern icon set
- **React i18n** - Internationalization

### **Backend**

- **Node.js** - Server runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Socket.IO** - Real-time communication

### **Development Tools**

- **ESLint** - Code quality
- **Vitest** - Unit testing
- **Docker** - Containerization

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Git
- PostgreSQL (opsiyonel - Supabase kullanılabilir)

### Projeyi Klonlayın

```bash
git clone https://github.com/kafkasder-portal/kafportal.git
cd kafportal
```

### Environment Variables

`.env` dosyası oluşturun:

```bash
cp env.example .env
```

Gerekli environment variables'ları ayarlayın:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
```

### Bağımlılıkları Yükleyin

```bash
npm install
```

### Backend Kurulumu

```bash
cd backend
npm install
```

### Geliştirme Sunucusunu Başlatın

```bash
# Frontend
npm run dev

# Backend (ayrı terminal)
cd backend
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 🚀 Build ve Deployment

### Production Build

```bash
npm run build
```

### Build Preview

```bash
npm run preview
```

### Lint Kontrolü

```bash
npm run lint
```

### Lint Düzeltme

```bash
npm run lint:fix
```

## 📁 Proje Yapısı

```
kafportal/
├── public/                 # Static files
├── src/
│   ├── animations.css      # Global animations
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   ├── components/        # Reusable components
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   ├── DeviceInfo.jsx # Device detection
│   │   ├── LoginForm.jsx  # Authentication
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── HospitalReferral.jsx # Hospital referral system
│   │   ├── AdvancedAnalytics.jsx # Analytics dashboard
│   │   ├── RealTimeDashboard.jsx # Real-time monitoring
│   │   ├── WorkflowAutomation.jsx # Workflow automation
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── NotificationContext.jsx # Notifications
│   ├── hooks/             # Custom hooks
│   │   └── useDeviceDetection.js # Device detection
│   ├── i18n/              # Internationalization
│   │   ├── index.js       # i18n configuration
│   │   └── locales/       # Language files
│   └── services/          # API services
├── backend/               # Backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── config/        # Configuration
│   │   └── server.ts      # Main server file
│   └── database/          # Database migrations
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## 📱 Responsive Tasarım

Portal tüm cihaz türlerinde mükemmel çalışır:

- **Desktop** - Full sidebar navigation
- **Tablet** - Collapsible sidebar
- **Mobile** - Bottom navigation bar

## 🌍 Çoklu Dil Desteği

- 🇹🇷 **Türkçe** - Ana dil
- 🇷🇺 **Русский** - İkinci dil
- Kolay genişletilebilir yapı

## 🔐 Güvenlik Özellikleri

- **Role-based Access Control** - Rol tabanlı erişim
- **Protected Routes** - Güvenli sayfa erişimi
- **Session Management** - Oturum yönetimi
- **Input Validation** - Giriş doğrulama
- **Fallback Authentication** - Supabase bağlantısı olmadığında alternatif auth

## 📊 Performance Özellikleri

- **Lazy Loading** - Sayfa bazında yükleme
- **Code Splitting** - Kod parçalama
- **Optimized Bundle** - Optimize edilmiş paketleme
- **Fast Refresh** - Hızlı yenileme

## 🔄 Changelog

### v2.1.0 (2025-01-XX)

- ✅ Supabase bağlantı hataları düzeltildi
- ✅ API client optimizasyonu yapıldı
- ✅ Gereksiz dosyalar temizlendi
- ✅ Package.json sadeleştirildi
- ✅ Vite config optimizasyonu
- ✅ Fallback authentication sistemi eklendi

### v2.0.0 (2025-08-22)

- ✅ Enterprise Analytics Dashboard eklendi
- ✅ Real-time Dashboard sistemi
- ✅ Workflow Automation engine
- ✅ Hastane Sevk Yönetimi modülü
- ✅ Advanced Form Builder
- ✅ Theme Customizer sistemi
- ✅ Performance optimizasyonları

### v1.0.0 (2024)

- ✅ Temel dernek yönetim sistemi
- ✅ Bağış ve gönüllü yönetimi
- ✅ Mali yönetim modülleri
- ✅ Responsive design
- ✅ Multi-language support

## 🌟 Öne Çıkan Özellikler

### QR Kod Sistemi
- Gerçekçi QR kod görselleştirmesi
- 21x21 modül standardı
- Corner marker ve timing pattern
- Yazdırma özelliği

### Kamera Entegrasyonu
- getUserMedia API kullanımı
- Arka kamera tercihi
- Hedefleme çerçevesi
- Otomatik temizleme

### Responsive Sidebar
- Cihaz tipine göre adaptasyon
- Mobilde hamburger menü
- Smooth animasyonlar

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👥 Ekip

- **Frontend Development** - Modern React architecture
- **UI/UX Design** - User-centered design
- **Backend Integration** - RESTful API integration
- **DevOps** - Build and deployment optimization

## 📞 İletişim

- **Proje Sahibi:** Kafkas Derneği
- **Repository:** [kafkasder-portal/kafportal](https://github.com/kafkasder-portal/kafportal)
- **Issues:** [GitHub Issues](https://github.com/kafkasder-portal/kafportal/issues)
- **Website:** [kafkasder.org](https://kafkasder.org)
- **Email:** info@kafkasder.org

---

<div align="center">

**🏛️ Kafkas Derneği Portal - Modern Dernek Yönetim Sistemi**

*Made with ❤️ for community management*

</div>

## 🙏 Teşekkürler

Bu projeye katkıda bulunan herkese teşekkür ederiz.

---

**Not**: Bu sistem, sivil toplum kuruluşlarının dijital dönüşümüne katkı sağlamak amacıyla geliştirilmiştir.
