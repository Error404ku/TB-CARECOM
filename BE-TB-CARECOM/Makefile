# TB-CARECOM Docker Makefile
# Simplified commands for Docker operations

.PHONY: help build up down restart logs shell db-shell migrate fresh seed backup restore clean

# Default target
help:
	@echo "TB-CARECOM Docker Commands:"
	@echo ""
	@echo "  build     - Build Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  logs      - Show logs for all services"
	@echo "  shell     - Access app container shell"
	@echo "  migrate   - Run database migrations"
	@echo "  fresh     - Fresh migration with seed"
	@echo "  seed      - Run database seeders"
	@echo "  clean     - Clean up Docker resources"
	@echo "  deploy    - Full deployment (build + up)"
	@echo ""

# Build Docker images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "🚀 Starting all services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "App: http://localhost:8082"
	@echo "DB: External Supabase (aws-0-ap-southeast-1.pooler.supabase.com:6543)"

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	docker-compose down

# Restart all services
restart: down up

# Show logs
logs:
	@echo "📋 Showing logs..."
	docker-compose logs -f

logs-app:
	docker-compose logs -f app



logs-nginx:
	docker-compose exec app tail -f /var/log/nginx/access.log

logs-nginx-error:
	docker-compose exec app tail -f /var/log/nginx/error.log

logs-php:
	docker-compose exec app tail -f /var/log/fpm-php.www.log

# Access app container shell
shell:
	@echo "🐚 Accessing app container..."
	docker-compose exec app bash



# Run migrations
migrate:
	@echo "📊 Running migrations..."
	docker-compose exec app php artisan migrate

# Fresh migration with seed
fresh:
	@echo "🔄 Running fresh migration..."
	docker-compose exec app php artisan migrate:fresh --seed

# Run seeders
seed:
	@echo "🌱 Running seeders..."
	docker-compose exec app php artisan db:seed



# Clean up Docker resources
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker system prune -f
	docker volume prune -f

# Full deployment
deploy: build up
	@echo "🎉 Deployment completed!"

# Development commands
dev-setup:
	@echo "🔧 Setting up development environment..."
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@if [ ! -f docker-compose.override.yml ]; then cp docker-compose.override.yml.example docker-compose.override.yml; fi
	@echo "✅ Development environment ready!"
	@echo "Please edit .env and docker-compose.override.yml as needed"

# Service management
restart-nginx:
	docker-compose exec app supervisorctl restart nginx

restart-php:
	docker-compose exec app supervisorctl restart php-fpm

restart-services:
	docker-compose exec app supervisorctl restart all

status-services:
	docker-compose exec app supervisorctl status

# Laravel commands
cache-clear:
	@echo "🗑️ Clearing cache..."
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

optimize:
	@echo "⚡ Optimizing application..."
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache

# Monitoring
status:
	@echo "📊 Service status:"
	docker-compose ps

stats:
	@echo "📈 Resource usage:"
	docker stats --no-stream

# Update application
update:
	@echo "🔄 Updating application..."
	git pull origin main
	make down
	make build
	make up
	make migrate
	@echo "✅ Application updated!"