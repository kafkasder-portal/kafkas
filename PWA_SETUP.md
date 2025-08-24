# PWA (Progressive Web App) Kurulumu

## ✅ Tamamlanan Özellikler

- [x] Vite PWA plugin yapılandırması
- [x] Service Worker otomatik registrasyonu
- [x] Manifest.json yapılandırması
- [x] Meta tag'ler ve favicon
- [x] Offline desteği
- [x] Otomatik güncelleme
- [x] App shortcuts (kısayollar)

## 🔧 Eksik Adımlar

### 1. PWA İkonları Oluşturun

Şu anda placeholder dosyalar var. Gerçek PNG ikonları oluşturmak için:

#### Seçenek A: ImageMagick kullanın
```bash
# ImageMagick yüklü ise
convert public/icon.svg -resize 64x64 public/pwa-64x64.png
convert public/icon.svg -resize 192x192 public/pwa-192x192.png
convert public/icon.svg -resize 512x512 public/pwa-512x512.png
convert public/icon.svg -resize 512x512 public/maskable-icon-512x512.png
```

#### Seçenek B: Online araçlar
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)

#### Seçenek C: Sharp ile Node.js script
```bash
npm install sharp
node scripts/convert-svg-to-png.js
```

### 2. Placeholder dosyaları silin
```bash
rm public/*.png.txt
```

## 🚀 PWA Özellikleri

### Ana Özellikler
- **Offline Çalışma**: Uygulama internet bağlantısı olmadan çalışır
- **Ana Ekrana Ekleme**: Kullanıcılar uygulamayı telefon ana ekranına ekleyebilir
- **Otomatik Güncelleme**: Yeni sürümler otomatik olarak güncellenir
- **App Shortcuts**: Hızlı eylemler için kısayollar

### Kısayollar
1. **Bağış Yönetimi** → `/donations`
2. **Gönüllü Yönetimi** → `/volunteers`
3. **Yardım Yönetimi** → `/aid`

### Service Worker Özellikleri
- Kaynak önbellekleme
- Offline geri dönüş
- Background sync
- Push notifications

## 🔍 Test Etme

### Chrome DevTools
1. F12 → Application tab
2. "Manifest" ve "Service Workers" kontrol edin
3. "Add to homescreen" test edin

### Lighthouse PWA Audit
1. F12 → Lighthouse tab
2. "Progressive Web App" seçin
3. Audit çalıştırın

## 📱 Kullanım

### Ana Ekrana Ekleme
1. Chrome'da uygulamayı açın
2. Adres çubuğunda "yükle" simgesine tıklayın
3. Veya menüden "Ana ekrana ekle" seçin

### Offline Kullanım
- İnternet bağlantısı kesildiğinde uygulama çalışmaya devam eder
- Önbelleğe alınan sayfalar erişilebilir
- Yeni veriler bağlantı geri geldiğinde senkronize edilir

## 🔧 Geliştirme

### PWA Test Modu
Geliştirme sırasında PWA özelliklerini test etmek için:
```bash
npm run build
npm run preview
```

### Manifest Güncelleme
`vite.config.js` dosyasında PWA ayarlarını düzenleyebilirsiniz.

### Service Worker Özelleştirme
Workbox ayarları ile önbellekleme stratejilerini değiştirebilirsiniz.
