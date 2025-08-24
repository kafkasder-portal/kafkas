#!/bin/bash

# =====================================================
# KAF PORTAL VERCEL DEPLOYMENT SCRIPT
# =====================================================

echo "🚀 KAF Portal Vercel Deployment Başlıyor..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    print_status "Vercel CLI kontrol ediliyor..."
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI bulunamadı. Yükleniyor..."
        npm install -g vercel
    else
        print_success "Vercel CLI zaten yüklü"
    fi
}

# Check if user is logged in to Vercel
check_vercel_login() {
    print_status "Vercel login durumu kontrol ediliyor..."
    if ! vercel whoami &> /dev/null; then
        print_warning "Vercel'e giriş yapılmamış. Giriş yapın..."
        vercel login
    else
        print_success "Vercel'e giriş yapılmış"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Vercel'e deploy ediliyor..."
    
    # Set environment variables
    export VITE_PUBLIC_SUPABASE_URL="https://fagblbogumttcrsbletc.supabase.co"
    export VITE_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo"
    export VITE_API_URL="https://kafkasders-projects-a2db16e2.vercel.app/api"
    export VITE_APP_NAME="Kafkas Derneği Portal"
    export VITE_APP_VERSION="1.0.0"
    export VITE_APP_ENVIRONMENT="production"
    export VITE_ENABLE_PWA="true"
    export VITE_ENABLE_ANALYTICS="true"
    export VITE_ENABLE_MONITORING="true"
    export VITE_ENABLE_ERROR_TRACKING="true"
    export VITE_ANALYTICS_ENDPOINT="/api/analytics"
    export VITE_HEALTH_ENDPOINT="/api/health"
    export VITE_PERFORMANCE_MONITORING="true"
    export VITE_WEB_VITALS_TRACKING="true"
    export VITE_ENABLE_HTTPS="true"
    export VITE_ENABLE_CSP="true"
    export VITE_ENABLE_WEBSOCKET="false"
    export VITE_WEBSOCKET_URL="wss://kafkasders-projects-a2db16e2.vercel.app"
    export VITE_DEFAULT_LOCALE="tr"
    export VITE_SUPPORTED_LOCALES="tr,en,ru"
    export VITE_DEV_MODE="false"
    export VITE_ENABLE_LOGGING="false"
    export VITE_ENABLE_DEBUG="false"
    
    # Deploy
    vercel --prod --yes
}

# Test deployment
test_deployment() {
    print_status "Deployment test ediliyor..."
    
    # Wait for deployment to complete
    sleep 10
    
    # Test health endpoint
    print_status "Health endpoint test ediliyor..."
    if curl -s "https://kafkasders-projects-a2db16e2.vercel.app/api/health" | grep -q "OK"; then
        print_success "Health endpoint çalışıyor"
    else
        print_error "Health endpoint çalışmıyor"
    fi
    
    # Test frontend
    print_status "Frontend test ediliyor..."
    if curl -s "https://kafkasders-projects-a2db16e2.vercel.app" | grep -q "Kafkas"; then
        print_success "Frontend çalışıyor"
    else
        print_warning "Frontend yükleniyor olabilir"
    fi
}

# Main deployment process
main() {
    echo "=========================================="
    echo "🚀 KAF Portal Vercel Deployment"
    echo "=========================================="
    
    # Check prerequisites
    check_vercel_cli
    check_vercel_login
    
    # Deploy
    deploy_to_vercel
    
    # Test
    test_deployment
    
    echo "=========================================="
    print_success "Deployment tamamlandı!"
    echo "=========================================="
    echo ""
    echo "📊 Erişim Bilgileri:"
    echo "Frontend: https://kafkasders-projects-a2db16e2.vercel.app"
    echo "API: https://kafkasders-projects-a2db16e2.vercel.app/api"
    echo "Health: https://kafkasders-projects-a2db16e2.vercel.app/api/health"
    echo "Monitoring: https://kafkasders-projects-a2db16e2.vercel.app/monitoring-dashboard"
    echo ""
    echo "🔧 Vercel Dashboard: https://vercel.com/kafkasders-projects-a2db16e2/"
    echo "🗄️ Supabase Dashboard: https://supabase.com/dashboard/project/fagblbogumttcrsbletc"
    echo ""
}

# Run main function
main
