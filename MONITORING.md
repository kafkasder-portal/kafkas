# 📊 KAF Portal Monitoring & Analytics Guide

Bu dokümantasyon KAF Portal uygulamasının kapsamlı monitoring ve analytics sistemini açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Monitoring Sistemi](#monitoring-sistemi)
- [Analytics Sistemi](#analytics-sistemi)
- [Dashboard Kullanımı](#dashboard-kullanımı)
- [API Endpoints](#api-endpoints)
- [Konfigürasyon](#konfigürasyon)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Genel Bakış

KAF Portal monitoring sistemi üç ana bileşenden oluşur:

1. **Performance Monitor**: Web Vitals, API performansı, bellek kullanımı
2. **Analytics Tracker**: Kullanıcı davranışları, sayfa görüntülemeleri, olaylar
3. **System Health Monitor**: Sistem sağlığı, ağ durumu, uygulama durumu

## 🔍 Monitoring Sistemi

### Performance Monitor

```javascript
import { performanceMonitor } from '../utils/monitoring'

// Web Vitals takibi
performanceMonitor.addObserver('LCP', (data) => {
  console.log('LCP:', data)
})

// API çağrı takibi
performanceMonitor.addObserver('api_call', (data) => {
  console.log('API Call:', data)
})

// Hata takibi
performanceMonitor.addObserver('error', (data) => {
  console.log('Error:', data)
})
```

#### Web Vitals Metrikleri

- **LCP (Largest Contentful Paint)**: En büyük içeriğin yüklenme süresi
- **FID (First Input Delay)**: İlk kullanıcı etkileşimi gecikmesi
- **CLS (Cumulative Layout Shift)**: Kümülatif layout kayması

#### Performans Skorları

```javascript
// Skor hesaplama
const scores = {
  lcp: lcp < 2500 ? 100 : lcp < 4000 ? 75 : lcp < 6000 ? 50 : 25,
  fid: fid < 100 ? 100 : fid < 300 ? 75 : fid < 500 ? 50 : 25,
  cls: cls < 0.1 ? 100 : cls < 0.25 ? 75 : cls < 0.5 ? 50 : 25
}
```

### System Health Monitor

```javascript
import { systemHealthMonitor } from '../utils/monitoring'

// Sistem sağlığı verilerini al
const healthData = systemHealthMonitor.getHealthData()

// Sağlık durumu kontrolü
const isHealthy = healthData.network?.status === 200
```

#### İzlenen Metrikler

- **CPU Kullanımı**: Sistem CPU yükü
- **Bellek Kullanımı**: Heap memory kullanımı
- **Ağ Durumu**: API yanıt süreleri ve durumları
- **Uygulama Durumu**: Özellik durumları ve versiyon bilgileri

## 📈 Analytics Sistemi

### Analytics Tracker

```javascript
import { analyticsTracker } from '../utils/monitoring'

// Sayfa görüntüleme takibi
analyticsTracker.trackPageView('/dashboard')

// Özel olay takibi
analyticsTracker.trackEvent('button_click', {
  buttonId: 'donate-button',
  amount: 100
})

// Kullanıcı özelliği ayarlama
analyticsTracker.setUserProperty('userType', 'donor')
```

#### Takip Edilen Olaylar

- **page_view**: Sayfa görüntülemeleri
- **button_click**: Buton tıklamaları
- **form_submit**: Form gönderimleri
- **api_call**: API çağrıları
- **error**: Hatalar

### Kullanıcı Davranış Analizi

```javascript
// Kullanıcı etkileşim takibi
analyticsTracker.trackEvent('user_interaction', {
  type: 'scroll',
  page: '/donations',
  duration: 30000
})

// Dönüşüm takibi
analyticsTracker.trackEvent('conversion', {
  type: 'donation',
  amount: 500,
  currency: 'TRY'
})
```

## 🎛️ Dashboard Kullanımı

### Monitoring Dashboard

Monitoring Dashboard'a `/monitoring-dashboard` adresinden erişebilirsiniz.

#### Sekmeler

1. **Genel Bakış**: Performans skorları, sistem durumu, analitik özeti
2. **Performans**: Web Vitals detayları, bellek kullanımı, API performansı
3. **Analitik**: Kullanıcı metrikleri, popüler sayfalar, trendler
4. **Sistem Sağlığı**: CPU, bellek, ağ durumu, uygulama özellikleri

#### Özellikler

- **Real-time Updates**: 5 saniyede bir otomatik güncelleme
- **Detaylı Görünüm**: Basit/detaylı görünüm seçenekleri
- **Otomatik Yenileme**: Açık/kapalı otomatik yenileme
- **Manuel Yenileme**: Manuel veri yenileme butonu

### Dashboard Bileşenleri

#### Performance Score Cards

```jsx
<PerformanceScoreCard
  title="Genel Performans"
  score={85}
  icon={Activity}
  description="Web Vitals ortalaması"
/>
```

#### System Status Cards

```jsx
<SystemStatusCard
  healthData={healthData}
  showDetails={true}
/>
```

#### Analytics Overview

```jsx
<AnalyticsOverviewCard
  analyticsData={analyticsData}
  showDetails={false}
/>
```

## 🔌 API Endpoints

### Metrics Endpoint

```javascript
// POST /api/analytics/metrics
{
  "performance": {
    "lcp": 1200,
    "fid": 50,
    "cls": 0.05,
    "memory": {
      "used": 45,
      "total": 100,
      "limit": 200
    }
  },
  "apiCalls": {
    "/api/donations": [
      {
        "method": "GET",
        "status": 200,
        "duration": 150,
        "success": true
      }
    ]
  },
  "errors": [],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sessionId": "session_1234567890_abc123"
}
```

### Events Endpoint

```javascript
// POST /api/analytics/events
{
  "name": "button_click",
  "properties": {
    "buttonId": "donate-button",
    "page": "/donations",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "sessionId": "session_1234567890_abc123"
  }
}
```

### Health Endpoint

```javascript
// POST /api/health/report
{
  "system": {
    "memory": {
      "used": 45,
      "total": 100,
      "limit": 200,
      "percentage": 22.5
    },
    "cpu": {
      "load": 15
    },
    "uptime": 3600
  },
  "network": {
    "status": 200,
    "responseTime": 150,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "application": {
    "version": "1.0.0",
    "environment": "production",
    "features": {
      "authentication": true,
      "database": true,
      "websocket": true
    }
  }
}
```

## ⚙️ Konfigürasyon

### Environment Variables

```bash
# Monitoring konfigürasyonu
VITE_ENABLE_MONITORING=true
VITE_MONITORING_INTERVAL=5000
VITE_ANALYTICS_ENDPOINT=/api/analytics
VITE_HEALTH_ENDPOINT=/api/health

# Performance thresholds
VITE_LCP_THRESHOLD=2500
VITE_FID_THRESHOLD=100
VITE_CLS_THRESHOLD=0.1

# Analytics konfigürasyonu
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_BATCH_SIZE=100
VITE_ANALYTICS_FLUSH_INTERVAL=30000
```

### Monitoring Initialization

```javascript
// src/main.jsx
import { initializeMonitoring } from './utils/monitoring'

// Monitoring'i başlat
initializeMonitoring()
```

### Custom Observers

```javascript
// Özel metrik takibi
performanceMonitor.addObserver('custom_metric', (data) => {
  // Özel işlemler
  console.log('Custom metric:', data)
  
  // Sunucuya gönder
  fetch('/api/custom-metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
})
```

## 🎯 Best Practices

### Performance Monitoring

1. **Web Vitals Takibi**: LCP, FID, CLS metriklerini sürekli izleyin
2. **API Performansı**: API çağrı sürelerini ve başarı oranlarını takip edin
3. **Bellek Kullanımı**: Memory leak'leri önlemek için bellek kullanımını izleyin
4. **Error Tracking**: Tüm hataları yakalayın ve analiz edin

### Analytics

1. **Kullanıcı Yolculuğu**: Kullanıcıların uygulamada nasıl hareket ettiğini takip edin
2. **Dönüşüm Takibi**: Önemli aksiyonları (bağış, kayıt vb.) takip edin
3. **A/B Testing**: Farklı özelliklerin performansını karşılaştırın
4. **Segmentasyon**: Kullanıcıları farklı gruplara ayırın

### System Health

1. **Proactive Monitoring**: Sorunları oluşmadan önce tespit edin
2. **Alerting**: Kritik durumlar için uyarı sistemi kurun
3. **Capacity Planning**: Sistem kapasitesini planlayın
4. **Incident Response**: Sorun çözme süreçlerini tanımlayın

## 🔧 Troubleshooting

### Yaygın Sorunlar

#### 1. Monitoring Verisi Görünmüyor

```javascript
// Monitoring'in başlatıldığını kontrol edin
console.log('Monitoring initialized:', performanceMonitor.isInitialized)

// Veri gönderimini kontrol edin
performanceMonitor.sendMetrics().then(() => {
  console.log('Metrics sent successfully')
}).catch(error => {
  console.error('Failed to send metrics:', error)
})
```

#### 2. Analytics Olayları Gönderilmiyor

```javascript
// Analytics'in başlatıldığını kontrol edin
console.log('Analytics initialized:', analyticsTracker.isInitialized)

// Manuel olay gönderimi
analyticsTracker.sendAllEvents().then(() => {
  console.log('Events sent successfully')
}).catch(error => {
  console.error('Failed to send events:', error)
})
```

#### 3. Dashboard Yüklenmiyor

```bash
# Console'da hataları kontrol edin
npm run dev

# Network sekmesinde API çağrılarını kontrol edin
# API endpoint'lerinin çalıştığından emin olun
```

### Debug Komutları

```javascript
// Monitoring durumunu kontrol et
console.log('Performance Monitor:', performanceMonitor.getMetrics())
console.log('Analytics Tracker:', analyticsTracker.events)
console.log('System Health:', systemHealthMonitor.getHealthData())

// Manuel veri gönderimi
performanceMonitor.sendMetrics()
analyticsTracker.sendAllEvents()
systemHealthMonitor.sendHealthData()
```

### Performance Optimizasyonu

```javascript
// Monitoring verilerini optimize et
const optimizedMetrics = {
  ...metrics,
  // Gereksiz verileri filtrele
  apiCalls: Object.fromEntries(
    Object.entries(metrics.apiCalls).filter(([url, calls]) => 
      calls.length > 0
    )
  ),
  // Hata sayısını sınırla
  errors: metrics.errors.slice(-10)
}
```

## 📊 Metrikler ve KPI'lar

### Performance KPI'ları

- **LCP < 2.5s**: Mükemmel
- **FID < 100ms**: Mükemmel
- **CLS < 0.1**: Mükemmel
- **API Response Time < 200ms**: İyi
- **Memory Usage < 80%**: İyi

### Analytics KPI'ları

- **Page Load Time < 3s**: İyi
- **Bounce Rate < 40%**: İyi
- **Session Duration > 2min**: İyi
- **Conversion Rate > 5%**: Mükemmel

### System Health KPI'ları

- **Uptime > 99.9%**: Mükemmel
- **API Success Rate > 99%**: İyi
- **CPU Usage < 70%**: İyi
- **Memory Usage < 80%**: İyi

## 🔮 Gelecek Özellikler

### Planlanan Geliştirmeler

1. **Real-time Alerts**: Kritik durumlar için anlık uyarılar
2. **Predictive Analytics**: Makine öğrenmesi ile tahmin analizi
3. **Custom Dashboards**: Kullanıcı tanımlı dashboard'lar
4. **Export Features**: Veri dışa aktarma özellikleri
5. **Integration APIs**: Üçüncü parti servis entegrasyonları

### Monitoring Roadmap

- **Q1 2024**: Temel monitoring sistemi
- **Q2 2024**: Advanced analytics ve reporting
- **Q3 2024**: AI-powered insights
- **Q4 2024**: Enterprise features

---

Bu monitoring guide sürekli güncellenmektedir. Yeni özellikler ve iyileştirmeler eklendikçe bu dokümantasyon da güncellenecektir.
