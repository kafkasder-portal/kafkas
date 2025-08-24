#!/bin/bash

# =====================================================
# VERCEL ENVIRONMENT VARIABLES SETUP SCRIPT
# =====================================================

echo "🔧 Environment Variables ayarlanıyor..."

# Environment variables
VARS=(
    "VITE_PUBLIC_SUPABASE_URL=https://fagblbogumttcrsbletc.supabase.co"
    "VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo"
    "VITE_API_URL=https://kafkasportal-8v8qrdpp6-kafkasders-projects-a2db16e2.vercel.app/api"
    "VITE_APP_NAME=Kafkas Derneği Portal"
    "VITE_APP_VERSION=1.0.0"
    "VITE_APP_ENVIRONMENT=production"
    "VITE_ENABLE_PWA=true"
    "VITE_ENABLE_ANALYTICS=true"
    "VITE_ENABLE_MONITORING=true"
    "VITE_ENABLE_ERROR_TRACKING=true"
    "VITE_ANALYTICS_ENDPOINT=/api/analytics"
    "VITE_HEALTH_ENDPOINT=/api/health"
    "VITE_ANALYTICS_BATCH_SIZE=100"
    "VITE_ANALYTICS_FLUSH_INTERVAL=30000"
    "VITE_PERFORMANCE_MONITORING=true"
    "VITE_WEB_VITALS_TRACKING=true"
    "VITE_ENABLE_HTTPS=true"
    "VITE_ENABLE_CSP=true"
    "VITE_ENABLE_WEBSOCKET=false"
    "VITE_DEFAULT_LOCALE=tr"
    "VITE_SUPPORTED_LOCALES=tr,en,ru"
    "VITE_DEV_MODE=false"
    "VITE_ENABLE_LOGGING=false"
    "VITE_ENABLE_DEBUG=false"
)

# Set each environment variable
for var in "${VARS[@]}"; do
    IFS='=' read -r key value <<< "$var"
    echo "Setting $key..."
    echo "$value" | vercel env add "$key" production --yes 2>/dev/null || echo "Variable $key already exists or error occurred"
done

echo "✅ Environment variables ayarlandı!"
