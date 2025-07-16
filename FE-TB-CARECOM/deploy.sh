#!/bin/bash

# TB-CARECOM Frontend Deployment Script
# Usage: ./deploy.sh [prod|dev|stop|logs]

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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Deploy production
deploy_production() {
    print_status "Deploying TB-CARECOM Frontend in Production Mode..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.production.example .env
        print_warning "Please edit .env file with your production values before continuing."
        print_status "Opening .env file for editing..."
        ${EDITOR:-nano} .env
    fi
    
    # Create logs directory
    mkdir -p logs/nginx
    
    # Build and start
    print_status "Building and starting containers..."
    docker-compose down --remove-orphans
    docker-compose up -d --build
    
    print_success "✅ Production deployment completed!"
    print_status "Frontend URL: http://localhost:3000"
    print_status "Health Check: http://localhost:3000/health"
    print_status "View logs: ./deploy.sh logs"
}

# Deploy development
deploy_development() {
    print_status "Deploying TB-CARECOM Frontend in Development Mode..."
    
    # Stop production if running
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Start development
    print_status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    docker-compose -f docker-compose.dev.yml up -d --build
    
    print_success "✅ Development deployment completed!"
    print_status "Development Server: http://localhost:5173"
    print_status "Hot reload is enabled for source code changes"
    print_status "View logs: ./deploy.sh logs dev"
}

# Stop containers
stop_containers() {
    print_status "Stopping all TB-CARECOM containers..."
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    print_success "✅ All containers stopped."
}

# Show logs
show_logs() {
    if [ "$1" = "dev" ]; then
        print_status "Showing development logs..."
        docker-compose -f docker-compose.dev.yml logs -f frontend-dev
    else
        print_status "Showing production logs..."
        docker-compose logs -f frontend
    fi
}

# Display help
show_help() {
    echo "TB-CARECOM Frontend Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  prod     Deploy in production mode"
    echo "  dev      Deploy in development mode"
    echo "  stop     Stop all containers"
    echo "  logs     Show production logs"
    echo "  logs dev Show development logs"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 prod           # Deploy production"
    echo "  $0 dev            # Deploy development"
    echo "  $0 logs           # View production logs"
    echo "  $0 stop           # Stop all containers"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "prod"|"production")
            deploy_production
            ;;
        "dev"|"development")
            deploy_development
            ;;
        "stop")
            stop_containers
            ;;
        "logs")
            show_logs $2
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 