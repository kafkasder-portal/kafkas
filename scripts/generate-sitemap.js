#!/usr/bin/env node

/**
 * Sitemap Generator for KAF Portal
 * Generates a sitemap.xml file for better SEO and deployment optimization
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const BASE_URL = process.env.BASE_URL || 'https://kafportal.com'
const OUTPUT_FILE = path.join(__dirname, '../dist/sitemap.xml')
const PRIORITY = {
  home: 1.0,
  dashboard: 0.9,
  donations: 0.8,
  beneficiaries: 0.8,
  meetings: 0.7,
  tasks: 0.7,
  volunteers: 0.7,
  inventory: 0.6,
  finance: 0.6,
  reports: 0.6,
  settings: 0.5,
  help: 0.4
}

// Define application routes
const routes = [
  { path: '/', priority: PRIORITY.home, changefreq: 'daily' },
  { path: '/dashboard', priority: PRIORITY.dashboard, changefreq: 'daily' },
  { path: '/donations', priority: PRIORITY.donations, changefreq: 'weekly' },
  { path: '/beneficiaries', priority: PRIORITY.beneficiaries, changefreq: 'weekly' },
  { path: '/meetings', priority: PRIORITY.meetings, changefreq: 'weekly' },
  { path: '/tasks', priority: PRIORITY.tasks, changefreq: 'daily' },
  { path: '/volunteers', priority: PRIORITY.volunteers, changefreq: 'weekly' },
  { path: '/inventory', priority: PRIORITY.inventory, changefreq: 'weekly' },
  { path: '/finance', priority: PRIORITY.finance, changefreq: 'weekly' },
  { path: '/reports', priority: PRIORITY.reports, changefreq: 'monthly' },
  { path: '/settings', priority: PRIORITY.settings, changefreq: 'monthly' },
  { path: '/help', priority: PRIORITY.help, changefreq: 'monthly' },
  // Add more routes as needed
]

// Generate sitemap XML
function generateSitemapXML() {
  const currentDate = new Date().toISOString()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  routes.forEach(route => {
    xml += '  <url>\n'
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`
    xml += `    <priority>${route.priority}</priority>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>'

  return xml
}

// Generate robots.txt
function generateRobotsTXT() {
  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /_next/

# Crawl delay
Crawl-delay: 1`

  return robotsContent
}

// Main function
function main() {
  try {
    console.log('🚀 Generating sitemap...')

    // Ensure dist directory exists
    const distDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }

    // Generate and write sitemap
    const sitemapXML = generateSitemapXML()
    fs.writeFileSync(OUTPUT_FILE, sitemapXML, 'utf8')
    console.log(`✅ Sitemap generated: ${OUTPUT_FILE}`)

    // Generate robots.txt
    const robotsFile = path.join(distDir, 'robots.txt')
    const robotsContent = generateRobotsTXT()
    fs.writeFileSync(robotsFile, robotsContent, 'utf8')
    console.log(`✅ Robots.txt generated: ${robotsFile}`)

    // Generate sitemap index for multiple languages
    const languages = ['tr', 'en', 'ru']
    const sitemapIndex = generateSitemapIndex(languages)
    const sitemapIndexFile = path.join(distDir, 'sitemap-index.xml')
    fs.writeFileSync(sitemapIndexFile, sitemapIndex, 'utf8')
    console.log(`✅ Sitemap index generated: ${sitemapIndexFile}`)

    console.log(`📊 Generated ${routes.length} URLs in sitemap`)
    console.log(`🌐 Base URL: ${BASE_URL}`)

  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message)
    process.exit(1)
  }
}

// Generate sitemap index for multiple languages
function generateSitemapIndex(languages) {
  const currentDate = new Date().toISOString()

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  languages.forEach(lang => {
    xml += '  <sitemap>\n'
    xml += `    <loc>${BASE_URL}/sitemap-${lang}.xml</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += '  </sitemap>\n'
  })

  xml += '</sitemapindex>'

  return xml
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateRobotsTXT, generateSitemapIndex, generateSitemapXML }

