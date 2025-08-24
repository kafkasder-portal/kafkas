#!/usr/bin/env node

/**
 * Build Validation Script for KAF Portal
 * Validates the production build for common issues and deployment readiness
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const DIST_DIR = path.join(__dirname, '../dist')
const MAX_BUNDLE_SIZE = 500 * 1024 // 500KB
const MAX_TOTAL_SIZE = 5 * 1024 * 1024 // 5MB

// Validation rules
const VALIDATION_RULES = {
  requiredFiles: [
    'index.html',
    'assets/js/index.js',
    'assets/css/index.css'
  ],
  requiredMeta: [
    'viewport',
    'description',
    'robots'
  ],
  securityHeaders: [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection'
  ]
}

// File size analysis
function analyzeFileSizes() {
  const files = []

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir)

    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const relativeItemPath = path.join(relativePath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath, relativeItemPath)
      } else {
        files.push({
          path: relativeItemPath,
          size: stat.size,
          sizeKB: Math.round(stat.size / 1024)
        })
      }
    })
  }

  scanDirectory(DIST_DIR)
  return files
}

// Validate HTML file
function validateHTML() {
  const htmlFile = path.join(DIST_DIR, 'index.html')

  if (!fs.existsSync(htmlFile)) {
    throw new Error('index.html not found in dist directory')
  }

  const htmlContent = fs.readFileSync(htmlFile, 'utf8')
  const issues = []

  // Check for required meta tags
  VALIDATION_RULES.requiredMeta.forEach(meta => {
    if (!htmlContent.includes(`name="${meta}"`) && !htmlContent.includes(`property="${meta}"`)) {
      issues.push(`Missing meta tag: ${meta}`)
    }
  })

  // Check for security headers
  if (!htmlContent.includes('Content-Security-Policy')) {
    issues.push('Missing Content-Security-Policy header')
  }

  // Check for proper DOCTYPE
  if (!htmlContent.includes('<!DOCTYPE html>')) {
    issues.push('Missing DOCTYPE declaration')
  }

  // Check for viewport meta tag
  if (!htmlContent.includes('viewport')) {
    issues.push('Missing viewport meta tag')
  }

  // Check for proper title
  if (!htmlContent.includes('<title>')) {
    issues.push('Missing title tag')
  }

  return {
    valid: issues.length === 0,
    issues
  }
}

// Validate bundle sizes
function validateBundleSizes(files) {
  const issues = []
  const jsFiles = files.filter(f => f.path.endsWith('.js'))
  const cssFiles = files.filter(f => f.path.endsWith('.css'))

  // Check individual file sizes
  jsFiles.forEach(file => {
    if (file.size > MAX_BUNDLE_SIZE) {
      issues.push(`Large JS file: ${file.path} (${file.sizeKB}KB)`)
    }
  })

  cssFiles.forEach(file => {
    if (file.size > MAX_BUNDLE_SIZE) {
      issues.push(`Large CSS file: ${file.path} (${file.sizeKB}KB)`)
    }
  })

  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  if (totalSize > MAX_TOTAL_SIZE) {
    issues.push(`Total build size too large: ${Math.round(totalSize / 1024 / 1024)}MB`)
  }

  return {
    valid: issues.length === 0,
    issues,
    stats: {
      totalFiles: files.length,
      totalSize: Math.round(totalSize / 1024 / 1024),
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      largestFile: files.reduce((max, file) => file.size > max.size ? file : max, files[0])
    }
  }
}

// Validate required files
function validateRequiredFiles() {
  const issues = []

  VALIDATION_RULES.requiredFiles.forEach(file => {
    const filePath = path.join(DIST_DIR, file)
    if (!fs.existsSync(filePath)) {
      issues.push(`Required file missing: ${file}`)
    }
  })

  return {
    valid: issues.length === 0,
    issues
  }
}

// Validate assets
function validateAssets(files) {
  const issues = []
  const assetFiles = files.filter(f =>
    f.path.includes('assets/') &&
    (f.path.endsWith('.js') || f.path.endsWith('.css') || f.path.endsWith('.html'))
  )

  // Check for source maps in production
  const sourceMaps = files.filter(f => f.path.endsWith('.map'))
  if (sourceMaps.length > 0) {
    issues.push(`Source maps found in production build: ${sourceMaps.length} files`)
  }

  // Check for development files
  const devFiles = files.filter(f =>
    f.path.includes('dev') ||
    f.path.includes('test') ||
    f.path.includes('spec')
  )
  if (devFiles.length > 0) {
    issues.push(`Development files found in production build: ${devFiles.length} files`)
  }

  return {
    valid: issues.length === 0,
    issues,
    stats: {
      assetFiles: assetFiles.length,
      sourceMaps: sourceMaps.length,
      devFiles: devFiles.length
    }
  }
}

// Generate validation report
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    overall: true,
    checks: results,
    summary: {
      totalChecks: Object.keys(results).length,
      passedChecks: Object.values(results).filter(r => r.valid).length,
      failedChecks: Object.values(results).filter(r => !r.valid).length
    }
  }

  report.overall = report.summary.failedChecks === 0

  return report
}

// Main validation function
function validateBuild() {
  console.log('🔍 Validating production build...')

  try {
    // Check if dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      throw new Error('Dist directory not found. Run npm run build first.')
    }

    const results = {}

    // Analyze file sizes
    console.log('📊 Analyzing file sizes...')
    const files = analyzeFileSizes()
    results.bundleSizes = validateBundleSizes(files)

    // Validate HTML
    console.log('📄 Validating HTML...')
    results.html = validateHTML()

    // Validate required files
    console.log('📁 Validating required files...')
    results.requiredFiles = validateRequiredFiles()

    // Validate assets
    console.log('🎨 Validating assets...')
    results.assets = validateAssets(files)

    // Generate report
    const report = generateReport(results)

    // Print results
    console.log('\n📋 Validation Results:')
    console.log('='.repeat(50))

    Object.entries(results).forEach(([check, result]) => {
      const status = result.valid ? '✅' : '❌'
      console.log(`${status} ${check}: ${result.valid ? 'PASSED' : 'FAILED'}`)

      if (!result.valid && result.issues) {
        result.issues.forEach(issue => {
          console.log(`   ⚠️  ${issue}`)
        })
      }

      if (result.stats) {
        console.log(`   📊 ${JSON.stringify(result.stats)}`)
      }
    })

    console.log('\n📈 Summary:')
    console.log(`   Total checks: ${report.summary.totalChecks}`)
    console.log(`   Passed: ${report.summary.passedChecks}`)
    console.log(`   Failed: ${report.summary.failedChecks}`)

    if (report.overall) {
      console.log('\n🎉 Build validation PASSED! Ready for deployment.')
    } else {
      console.log('\n⚠️  Build validation FAILED! Please fix issues before deployment.')
      process.exit(1)
    }

    // Save report to file
    const reportFile = path.join(DIST_DIR, 'build-validation-report.json')
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
    console.log(`📄 Validation report saved: ${reportFile}`)

  } catch (error) {
    console.error('❌ Validation error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateBuild()
}

export { analyzeFileSizes, validateBuild, validateBundleSizes, validateHTML }

