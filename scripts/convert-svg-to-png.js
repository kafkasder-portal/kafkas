// Bu script Sharp kullanarak SVG'yi PNG'ye dönüştürür
// Kullanım: npm install sharp && node scripts/convert-svg-to-png.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '..', 'public', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'public');

const iconSizes = [
  { name: 'pwa-64x64.png', size: 64 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'maskable-icon-512x512.png', size: 512 }
];

async function generateIcons() {
  console.log('PWA İkon Üretici');
  console.log('================');
  console.log('');

  // Check if input SVG exists
  if (!fs.existsSync(inputSvg)) {
    console.error('❌ SVG dosyası bulunamadı:', inputSvg);
    console.log('   Önce public/icon.svg dosyasını oluşturun.');
    return;
  }

  console.log('📁 Kaynak:', inputSvg);
  console.log('📁 Hedef:', outputDir);
  console.log('');

  try {
    // Generate each icon size
    for (const icon of iconSizes) {
      const outputPath = path.join(outputDir, icon.name);
      
      console.log(`🔄 Oluşturuluyor: ${icon.name} (${icon.size}x${icon.size})`);
      
      await sharp(inputSvg)
        .resize(icon.size, icon.size)
        .png({
          quality: 90,
          compressionLevel: 9
        })
        .toFile(outputPath);
      
      console.log(`✅ Tamamlandı: ${icon.name}`);
    }

    // Remove placeholder files
    console.log('');
    console.log('🧹 Placeholder dosyalar temizleniyor...');
    
    for (const icon of iconSizes) {
      const placeholderPath = path.join(outputDir, icon.name + '.txt');
      if (fs.existsSync(placeholderPath)) {
        fs.unlinkSync(placeholderPath);
        console.log(`🗑️  Silindi: ${icon.name}.txt`);
      }
    }

    console.log('');
    console.log('🎉 Tüm PWA ikonları başarıyla oluşturuldu!');
    console.log('');
    console.log('📋 Sonraki adımlar:');
    console.log('   1. npm run build');
    console.log('   2. npm run preview');
    console.log('   3. DevTools → Application → Manifest kontrol edin');
    console.log('   4. PWA\'yı ana ekrana ekleyin');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('');
    console.log('🔧 Çözüm önerileri:');
    console.log('   1. Sharp yükleyin: npm install sharp');
    console.log('   2. SVG dosyasının doğru formatta olduğundan emin olun');
    console.log('   3. Yazma izinlerini kontrol edin');
  }
}

// Alternative method without Sharp (if Sharp is not available)
function generateAlternativeInstructions() {
  console.log('⚠️  Sharp mevcut değil. Alternatif yöntemler:');
  console.log('');
  console.log('1. ImageMagick ile:');
  iconSizes.forEach(icon => {
    console.log(`   convert public/icon.svg -resize ${icon.size}x${icon.size} public/${icon.name}`);
  });
  console.log('');
  console.log('2. Online araçlar:');
  console.log('   - https://realfavicongenerator.net/');
  console.log('   - https://www.pwabuilder.com/imageGenerator');
  console.log('');
  console.log('3. Sharp yükleyip tekrar deneyin:');
  console.log('   npm install sharp');
  console.log('   node scripts/convert-svg-to-png.js');
}

// Check if Sharp is available
try {
  require.resolve('sharp');
  generateIcons();
} catch (error) {
  generateAlternativeInstructions();
}
