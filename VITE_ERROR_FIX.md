# Vite WebSocket Error Fix 🔧

Bu dokümantasyon, `TypeError: Cannot read properties of undefined (reading 'send')` hatasının çözümünü açıklar.

## 🐛 Problem

Vite dev server'da WebSocket (HMR - Hot Module Replacement) bağlantısında yaşanan hata:

```
[vite] TypeError: Cannot read properties of undefined (reading 'send')
```

## 🔍 Sebepleri

1. **PWA Plugin Conflict**: PWA plugin development modunda HMR ile çakışma
2. **WebSocket Configuration**: Yanlış HMR yapılandırması
3. **Service Worker Interference**: Service worker'ın WebSocket bağlantısına müdahale etmesi
4. **Network Issues**: Proxy veya ağ bağlantı sorunları

## ✅ Uygulanan Çözümler

### 1. **HMR Configuration Fix**

`vite.config.js` dosyasında HMR ayarları düzeltildi:

```javascript
server: {
  port: 5173,
  host: true,
  hmr: {
    overlay: true,          // Error overlay açıldı
    port: 5173,            // Açık port belirtildi
    host: 'localhost',     // Host belirtildi
    clientPort: 5173,      // Client port belirtildi
  },
  force: true,             // Dependency pre-bundling zorlandı
}
```

### 2. **PWA Plugin Development Disable**

PWA plugin development modunda devre dışı bırakıldı:

```javascript
VitePWA({
  devOptions: {
    enabled: false,  // Development'da devre dışı
    type: 'module'
  }
})
```

### 3. **Conditional PWA Registration**

`src/main.jsx` dosyasında PWA sadece production'da çalışacak şekilde ayarlandı:

```javascript
// PWA sadece production'da
if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    // PWA registration logic
  }).catch(() => {
    console.log('PWA development modunda devre dışı')
  })
}
```

### 4. **Error Handling Script**

`vite-client-error-fix.js` dosyası oluşturuldu:

```javascript
// WebSocket hatalarını yakala ve handle et
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (err) => {
    console.warn('Vite error caught:', err);
  });
  
  import.meta.hot.on('vite:ws:disconnect', () => {
    console.log('WebSocket disconnected. Attempting to reconnect...');
  });
}
```

## 🧪 Test Etme

### 1. **Debug Script Çalıştır**

Browser console'da debug script'ini çalıştır:

```javascript
// debug-vite-hmr.js dosyasının içeriğini console'a yapıştır
```

### 2. **HMR Test**

1. Herhangi bir dosyayı değiştir
2. Browser'da otomatik güncelleme olup olmadığını kontrol et
3. Console'da WebSocket bağlantı mesajlarını gözlemle

### 3. **Network Tab Kontrolü**

1. F12 → Network tab
2. WS (WebSocket) filtresi uygula
3. WebSocket bağlantılarını kontrol et

## 🚀 Sonuçlar

✅ **WebSocket bağlantı hatası çözüldü**  
✅ **HMR normal çalışıyor**  
✅ **PWA production'da aktif**  
✅ **Error handling mevcut**  
✅ **Dev server stabil**  

## 🔧 Özelleştirme

### Manual WebSocket Port

Farkl�� port kullanmak için:

```javascript
server: {
  hmr: {
    port: 24678,  // Farklı port
  }
}
```

### HMR Completely Disable

HMR'ı tamamen kapatmak için:

```javascript
server: {
  hmr: false
}
```

### Debug Mode

Daha fazla log için:

```javascript
server: {
  hmr: {
    overlay: true,
    clientPort: 5173,
  }
}
```

## 📋 Checklist

- [x] PWA plugin development'da devre dışı
- [x] HMR configuration düzeltildi
- [x] Error handling eklendi
- [x] WebSocket bağlantı kontrolü
- [x] Service worker conflict çözüldü
- [x] Dev server restart yapıldı

## 🔄 Restart Required

Bu değişiklikler sonrası dev server restart gerekiyordu ve yapıldı:

```bash
npm run dev
# veya
yarn dev
```

## 🎯 İleride Dikkat Edilecekler

1. **PWA updates**: Production build'de PWA'nın çalıştığından emin ol
2. **HMR performance**: Büyük projerde HMR performansını izle
3. **WebSocket limits**: Çok fazla dosya değişikliğinde WebSocket limit'lerini kontrol et
4. **Browser cache**: Hard refresh gerekebilir (Ctrl+Shift+R)

Bu fix ile Vite WebSocket hataları çözülmüş ve development experience iyileştirilmiştir! 🚀
