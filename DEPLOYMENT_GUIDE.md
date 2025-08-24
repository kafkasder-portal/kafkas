# 🚀 KAF Portal Deployment Guide

## 📋 Overview

Bu rehber KAF Portal projesinin GitHub Actions ve Vercel ile CI/CD pipeline'ını açıklar.

## 🏗️ CI/CD Pipeline

### GitHub Actions Workflow

Pipeline şu adımları içerir:

1. **Lint and Test** - Kod kalitesi kontrolü
2. **Build** - Uygulama derleme
3. **Security Scan** - Güvenlik taraması
4. **Performance Test** - Performans testleri
5. **Deploy to Staging** - Staging ortamına deployment
6. **Deploy to Production** - Production ortamına deployment
7. **Notify Team** - Takım bildirimi
8. **Update Documentation** - Dokümantasyon güncelleme

### Workflow Triggers

- **Push to main** → Production deployment
- **Push to develop** → Staging deployment
- **Pull Request** → Test ve lint kontrolü

## 🔧 Setup

### 1. GitHub Secrets

GitHub repository'de şu secrets'ları ayarlayın:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Security
SNYK_TOKEN=your_snyk_token

# Notifications
SLACK_WEBHOOK=your_slack_webhook_url
```

### 2. Vercel Setup

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Vercel'e login
vercel login

# Proje bağlantısı
vercel link
```

### 3. Environment Variables

#### Staging Environment
```bash
NODE_ENV=staging
VITE_APP_ENV=staging
VITE_API_URL=https://staging-api.kafportal.com
VITE_SUPABASE_URL=your_staging_supabase_url
VITE_SUPABASE_ANON_KEY=your_staging_supabase_key
```

#### Production Environment
```bash
NODE_ENV=production
VITE_APP_ENV=production
VITE_API_URL=https://api.kafportal.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🚀 Deployment

### Automatic Deployment

1. **Staging**: `develop` branch'e push
2. **Production**: `main` branch'e push

### Manual Deployment

```bash
# Staging deployment
./scripts/deploy.sh staging

# Production deployment
./scripts/deploy.sh production

# With tests and performance checks
./scripts/deploy.sh -t -p production

# With notifications
./scripts/deploy.sh -t -p -n production
```

### Vercel CLI Deployment

```bash
# Staging
vercel

# Production
vercel --prod
```

## 📊 Monitoring

### Performance Monitoring

- **Lighthouse CI**: Otomatik performans testleri
- **Core Web Vitals**: LCP, FID, CLS izleme
- **Bundle Analysis**: Bundle boyutu analizi

### Security Monitoring

- **Snyk**: Güvenlik açığı taraması
- **npm audit**: Dependency güvenlik kontrolü

### Error Monitoring

- **Vercel Analytics**: Hata izleme
- **Sentry**: Detaylı hata raporlama

## 🔍 Quality Gates

### Performance Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Performance Score | > 80 | Warning |
| Accessibility | > 90 | Error |
| Best Practices | > 80 | Warning |
| SEO | > 80 | Warning |
| LCP | < 2.5s | Warning |
| FID | < 100ms | Warning |
| CLS | < 0.1 | Warning |

### Test Coverage

- **Unit Tests**: > 80% coverage
- **Integration Tests**: > 70% coverage
- **E2E Tests**: Critical paths

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm run clean
npm run build
```

#### Test Failures

```bash
# Run tests locally
npm run test:unit
npm run test:integration
npm run test:e2e

# Check coverage
npm run test:coverage
```

#### Performance Issues

```bash
# Run Lighthouse locally
npm run lighthouse

# Bundle analysis
npm run analyze
```

### Debug Commands

```bash
# Check environment
echo $NODE_ENV
echo $VITE_APP_ENV

# Check Vercel status
vercel ls

# Check build output
ls -la dist/
```

## 📈 Best Practices

### Code Quality

1. **Pre-commit Hooks**: Otomatik lint ve test
2. **Code Review**: PR review zorunlu
3. **TypeScript**: Strict mode aktif
4. **ESLint**: Kod standartları kontrolü

### Performance

1. **Bundle Splitting**: Code splitting aktif
2. **Image Optimization**: WebP ve lazy loading
3. **Caching**: Service Worker ve API caching
4. **Monitoring**: Real-time performans izleme

### Security

1. **Dependency Updates**: Otomatik güvenlik taraması
2. **Environment Variables**: Güvenli secret yönetimi
3. **HTTPS**: Zorunlu HTTPS
4. **CSP**: Content Security Policy

## 🔄 Rollback

### Emergency Rollback

```bash
# Vercel rollback
vercel rollback

# GitHub Actions rollback
# Previous deployment'e geri dön
```

### Database Rollback

```bash
# Supabase rollback
supabase db reset

# Migration rollback
supabase migration down
```

## 📞 Support

### Team Notifications

- **Slack**: Deployment bildirimleri
- **Email**: Critical error alerts
- **SMS**: Emergency notifications

### Documentation

- **GitHub Wiki**: Detaylı dokümantasyon
- **Storybook**: Component dokümantasyonu
- **API Docs**: Swagger/OpenAPI

## 🎯 Success Metrics

### Deployment Success Rate
- **Target**: > 95%
- **Current**: Monitoring

### Performance Metrics
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Error Rate
- **Target**: < 0.1%
- **Monitoring**: Vercel Analytics

---

**🚀 KAF Portal CI/CD Pipeline başarıyla kuruldu!**
