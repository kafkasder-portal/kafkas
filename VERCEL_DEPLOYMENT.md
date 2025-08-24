# 🚀 Vercel Deployment Rehberi

## 📋 Ön Gereksinimler

1. **Vercel Hesabı**: [vercel.com](https://vercel.com) üzerinden ücretsiz hesap oluşturun
2. **GitHub Repository**: Proje GitHub'da olmalı
3. **Environment Variables**: Production değişkenleri hazır olmalı

## 🔧 Deployment Adımları

### 1. Vercel CLI Kurulumu (Opsiyonel)
```bash
npm i -g vercel
vercel login
```

### 2. GitHub ile Vercel Bağlantısı
1. [Vercel Dashboard](https://vercel.com/dashboard) → "New Project"
2. GitHub repository'yi seç: `kafportal-main`
3. Framework: **Vite** seçilecek otomatik
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 3. Environment Variables Ayarları

Vercel Dashboard → Project Settings → Environment Variables:

#### Production Variables:
```bash
# Supabase
VITE_PUBLIC_SUPABASE_URL=your-supabase-url
VITE_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API
VITE_API_URL=https://your-app.vercel.app/api

# App Config
VITE_APP_NAME=KAF Portal
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_MONITORING=true

# Security
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Domain Konfigürasyonu
1. Vercel Dashboard → Project → Settings → Domains
2. Custom domain ekle: `your-domain.com`
3. DNS ayarlarını güncelle

## 📊 Performance Optimizasyonları

### Vercel Edge Network
- Otomatik CDN
- Global edge locations
- Automatic compression (gzip/brotli)

### Build Optimizasyonları
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs22.x",
      "memory": 1024
    }
  },
  "regions": ["iad1"]
}
```

## 🔍 Monitoring & Analytics

### Vercel Analytics
- Real User Monitoring (RUM)
- Core Web Vitals
- Custom events tracking

### Speed Insights
- Performance metrics
- Loading performance
- Runtime performance

## 🌐 API Endpoints

### Serverless Functions
- `api/auth/login.ts` - Authentication
- `api/users/*.ts` - User management
- `api/data/*.ts` - Data operations

### Edge Functions (Optional)
- A/B testing
- Geolocation-based content
- Request/response modifications

## 🚀 Deployment Workflow

### Automatic Deployments
- **Production**: `main` branch → Production deployment
- **Preview**: Pull requests → Preview deployments
- **Development**: `develop` branch → Development deployment

### Manual Deploy
```bash
vercel --prod  # Production deploy
vercel         # Preview deploy
```

## 📈 Performance Monitoring

### Vercel Dashboard Metrics
- Build duration
- Function execution time
- Bandwidth usage
- Error rates

### Lighthouse Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## 🔒 Security

### Automatic Security
- HTTPS by default
- DDoS protection
- Rate limiting
- Security headers

### Custom Security
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🎯 Best Practices

### Build Performance
- Use `npm ci` instead of `npm install`
- Enable build cache
- Optimize bundle size

### Runtime Performance  
- Use Edge Functions for dynamic content
- Implement proper caching strategies
- Optimize images with Vercel Image

### Cost Optimization
- Monitor function execution time
- Use appropriate memory limits
- Implement efficient caching

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/guides/deploying-vite-to-vercel)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Performance Best Practices](https://vercel.com/docs/concepts/speed)

## 🎉 Go Live Checklist

- [ ] Environment variables configured
- [ ] Custom domain added
- [ ] SSL certificate active
- [ ] Analytics enabled  
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Backup strategy planned
- [ ] Team access configured
