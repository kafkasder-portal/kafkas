#!/bin/bash

# KAF Portal Deployment Script
# This script handles deployment to different environments

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment
validate_environment() {
    local env=$1
    
    case $env in
        "staging"|"production")
            return 0
            ;;
        *)
            print_error "Invalid environment: $env. Use 'staging' or 'production'"
            exit 1
            ;;
    esac
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if ! npm run test:unit; then
        print_error "Unit tests failed"
        exit 1
    fi
    
    if ! npm run test:integration; then
        print_error "Integration tests failed"
        exit 1
    fi
    
    print_success "All tests passed"
}

# Function to build application
build_application() {
    local env=$1
    
    print_status "Building application for $env environment..."
    
    # Set environment variables
    export NODE_ENV=production
    export VITE_APP_ENV=$env
    
    # Clean previous build
    rm -rf dist/
    
    # Install dependencies
    npm ci --only=production
    
    # Build application
    if ! npm run build; then
        print_error "Build failed"
        exit 1
    fi
    
    print_success "Build completed successfully"
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Start preview server
    npm run preview &
    local server_pid=$!
    
    # Wait for server to start
    sleep 10
    
    # Run Lighthouse CI
    if command_exists lhci; then
        if ! lhci autorun; then
            print_warning "Performance tests failed, but continuing deployment"
        else
            print_success "Performance tests passed"
        fi
    else
        print_warning "Lighthouse CI not installed, skipping performance tests"
    fi
    
    # Stop preview server
    kill $server_pid 2>/dev/null || true
}

# Function to deploy to Vercel
deploy_to_vercel() {
    local env=$1
    
    print_status "Deploying to Vercel ($env)..."
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    # Deploy to Vercel
    if [ "$env" = "production" ]; then
        if ! vercel --prod; then
            print_error "Production deployment failed"
            exit 1
        fi
    else
        if ! vercel; then
            print_error "Staging deployment failed"
            exit 1
        fi
    fi
    
    print_success "Deployment to Vercel completed"
}

# Function to notify team
notify_team() {
    local env=$1
    local status=$2
    
    print_status "Notifying team about deployment..."
    
    # Send Slack notification (if webhook is configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        local message="Deployment to $env environment $status"
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    print_success "Team notification sent"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS] ENVIRONMENT"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -t, --test     Run tests before deployment"
    echo "  -p, --perf     Run performance tests"
    echo "  -n, --notify   Send notifications"
    echo ""
    echo "Environments:"
    echo "  staging        Deploy to staging environment"
    echo "  production     Deploy to production environment"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 -t -p production"
    echo "  $0 --test --perf --notify production"
}

# Main deployment function
main() {
    local run_tests_flag=false
    local run_perf_flag=false
    local notify_flag=false
    local environment=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -t|--test)
                run_tests_flag=true
                shift
                ;;
            -p|--perf)
                run_perf_flag=true
                shift
                ;;
            -n|--notify)
                notify_flag=true
                shift
                ;;
            staging|production)
                environment=$1
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check if environment is provided
    if [ -z "$environment" ]; then
        print_error "Environment not specified"
        show_help
        exit 1
    fi
    
    # Validate environment
    validate_environment "$environment"
    
    print_status "Starting deployment to $environment environment..."
    
    # Run tests if requested
    if [ "$run_tests_flag" = true ]; then
        run_tests
    fi
    
    # Build application
    build_application "$environment"
    
    # Run performance tests if requested
    if [ "$run_perf_flag" = true ]; then
        run_performance_tests
    fi
    
    # Deploy to Vercel
    deploy_to_vercel "$environment"
    
    # Notify team if requested
    if [ "$notify_flag" = true ]; then
        notify_team "$environment" "completed successfully"
    fi
    
    print_success "Deployment to $environment completed successfully!"
}

# Run main function with all arguments
main "$@"
