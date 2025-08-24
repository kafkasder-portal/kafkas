# Veritabanı Migration Kılavuzu

Bu kılavuz, Kafkas Derneği Portal projesi için veritabanı migration işlemlerini açıklar.

## Migration Sistemi

Proje, PostgreSQL veritabanı için otomatik migration sistemi kullanır. Migration dosyaları `database/migrations/` klasöründe bulunur.

## Kurulum

1. **Veritabanı Oluşturma:**
   ```bash
   createdb kafkasder_portal
   ```

2. **Environment Değişkenleri:**
   `.env` dosyasını oluşturun ve veritabanı bilgilerini ekleyin:
   ```bash
   cp .env.example .env
   ```

3. **Migration Çalıştırma:**
   ```bash
   npm run migrate
   ```

## Migration Komutları

### Temel Komutlar

```bash
# Bekleyen migration'ları uygula
npm run migrate

# Migration durumunu kontrol et
npm run migrate:status

# Belirli bir migration'ı geri al
npm run migrate:rollback 001_initial_schema

# Veritabanını sıfırla ve yeniden kur
npm run db:reset
```

### Migration Durumu

```bash
npm run migrate:status
```

Bu komut şunları gösterir:
- Toplam migration sayısı
- Uygulanmış migration'lar
- Bekleyen migration'lar

## Migration Dosyaları

### Mevcut Migration'lar

1. **001_initial_schema.sql** - Temel veritabanı şeması
   - Kullanıcılar (users)
   - Bağışlar (donations)
   - Yararlanıcılar (beneficiaries)
   - Yardım kayıtları (aid_records)
   - Hastane sevkleri (hospital_referrals)
   - Gönüllüler (volunteers)
   - Projeler (projects)
   - Proje gönüllüleri (project_volunteers)
   - Giderler (expenses)
   - Raporlar (reports)
   - Denetim kayıtları (audit_logs)

2. **002_indexes_and_triggers.sql** - İndeksler ve tetikleyiciler
   - Performans için indeksler
   - Otomatik timestamp güncellemeleri
   - Veri bütünlüğü kontrolleri

## Yeni Migration Oluşturma

1. **Migration Dosyası Oluşturma:**
   ```bash
   # Dosya adı formatı: XXX_description.sql
   touch database/migrations/003_add_new_feature.sql
   ```

2. **Migration İçeriği:**
   ```sql
   -- Migration: 003_add_new_feature
   -- Description: Add new feature to the system
   -- Created: 2025-01-22
   
   -- Your SQL commands here
   ALTER TABLE users ADD COLUMN new_field VARCHAR(100);
   
   -- Migration tracking
   INSERT INTO schema_migrations (version) VALUES ('003_add_new_feature') ON CONFLICT DO NOTHING;
   ```

3. **Migration Uygulama:**
   ```bash
   npm run migrate
   ```

## Veritabanı Şeması

### Ana Tablolar

- **users**: Sistem kullanıcıları
- **donations**: Bağış kayıtları
- **beneficiaries**: Yararlanıcı bilgileri
- **aid_records**: Yapılan yardımlar
- **hospital_referrals**: Hastane sevk işlemleri
- **volunteers**: Gönüllü bilgileri
- **projects**: Proje yönetimi
- **expenses**: Gider takibi
- **reports**: Rapor sistemi
- **audit_logs**: Sistem denetim kayıtları

### İlişkiler

- Kullanıcılar birden fazla role sahip olabilir
- Yararlanıcılar birden fazla yardım alabilir
- Projeler birden fazla gönüllüye sahip olabilir
- Giderler projelere bağlanabilir

## Güvenlik

- Tüm hassas işlemler transaction içinde yapılır
- Migration rollback özelliği mevcuttur
- Audit log sistemi tüm değişiklikleri takip eder

## Sorun Giderme

### Migration Hatası

```bash
# Migration durumunu kontrol et
npm run migrate:status

# Hatalı migration'ı geri al
npm run migrate:rollback <migration_version>

# Düzeltme yapıp tekrar uygula
npm run migrate
```

### Veritabanı Bağlantı Hatası

1. `.env` dosyasındaki veritabanı bilgilerini kontrol edin
2. PostgreSQL servisinin çalıştığından emin olun
3. Veritabanının mevcut olduğunu kontrol edin

### Permission Hatası

```bash
# PostgreSQL kullanıcısına gerekli yetkileri verin
GRANT ALL PRIVILEGES ON DATABASE kafkasder_portal TO your_user;
```

## Best Practices

1. **Migration Dosya Adlandırma:**
   - Sıralı numara kullanın (001, 002, 003...)
   - Açıklayıcı isim verin
   - Tarih ekleyin

2. **Migration İçeriği:**
   - Her migration tek bir özellik için olmalı
   - Geri alınabilir olmalı
   - Test edilmiş olmalı

3. **Veritabanı Değişiklikleri:**
   - Büyük değişiklikler için backup alın
   - Production'da önce test edin
   - Migration'ları küçük parçalara bölün

## Destek

Sorularınız için proje ekibiyle iletişime geçin.