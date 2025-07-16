#!/bin/bash

# TB-CARECOM Deployment Script
# This script helps deploy the application on server

set -e

echo "🚀 Starting TB-CARECOM deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true

# Remove old images (optional)
read -p "Do you want to remove old Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing old Docker images..."
    docker system prune -f
fi

# Copy environment file
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        print_status "Copying .env.production to .env..."
        cp .env.production .env
        print_warning "Please edit .env file with your production settings before continuing."
        read -p "Press Enter to continue after editing .env file..."
    else
        print_error ".env file not found. Please create one based on .env.example"
        exit 1
    fi
fi

# Build and start containers
print_status "Building and starting containers..."
docker-compose up --build -d

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Deployment successful!"
    echo
    print_status "Application is running at: http://localhost:8082"
print_status "Database: External Supabase (aws-0-ap-southeast-1.pooler.supabase.com:6543)"
    echo
    print_status "To view logs: docker-compose logs -f"
    print_status "To stop: docker-compose down"
else
    print_error "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi

echo
print_status "🎉 TB-CARECOM deployment completed!"