# TB-CARECOM Docker Deployment Guide

Panduan lengkap untuk deploy aplikasi TB-CARECOM menggunakan Docker di server production.

## Prerequisites

-   Docker Engine 20.10+
-   Docker Compose 2.0+
-   Git
-   Minimal 2GB RAM
-   Minimal 10GB disk space

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/TB-CARECOM.git
cd TB-CARECOM/BE-TB-CARECOM
```

### 2. Setup Environment

```bash
# Copy production environment template
cp .env.production .env

# Edit environment variables
nano .env
```

### 3. Deploy with Script

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 4. Manual Deployment (Alternative)

```bash
# Build and start containers
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Architecture

This deployment uses a modern **Nginx + PHP-FPM** stack for optimal performance:

-   **Nginx**: High-performance web server handling HTTP requests
-   **PHP-FPM**: FastCGI Process Manager for efficient PHP processing
-   **Supervisor**: Process manager ensuring both services run reliably
-   **PostgreSQL**: Robust database for data persistence

## Environment Configuration

### Required Environment Variables

Edit `.env` file dengan konfigurasi berikut:

```env
# Application
APP_NAME=TB-CARECOM
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-domain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tb_carecom
DB_USERNAME=tb_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_very_strong_jwt_secret_key

# Mail (Optional)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password

# Cloudinary (Optional)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## Services

### Application (tb-carecom-app)

-   **Port**: 8082
-   **Technology**: PHP 8.2-FPM + Nginx
-   **Framework**: Laravel 12

### Database (External Supabase)

-   **Host**: aws-0-ap-southeast-1.pooler.supabase.com:6543
-   **Technology**: PostgreSQL (Supabase)
-   **Database**: postgres
-   **User**: postgres.xduwjlxthomxiempuhoh
-   **Connection**: External managed database
-   **Benefits**: Managed, scalable, with built-in features

## Docker Commands

### Basic Operations

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f db
```

### Application Management

```bash
# Execute commands in app container
docker-compose exec app php artisan migrate
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:cache

# Access app container shell
docker-compose exec app bash

# Run migrations
docker-compose exec app php artisan migrate

# Run database seeders
docker-compose exec app php artisan db:seed

# Note: Direct database access not available as we're using external Supabase database
```

### Maintenance

```bash
# Update application
git pull origin main
docker-compose down
docker-compose up --build -d

# Backup database
docker-compose exec db pg_dump -U tb_user tb_carecom > backup.sql

# Restore database
docker-compose exec -T db psql -U tb_user tb_carecom < backup.sql

# Clean up unused images
docker system prune -f
```

## Troubleshooting

### Common Issues

1. **Port already in use**

    ```bash
    # Check what's using the port
    sudo lsof -i :8082

    # Kill the process or change port in docker-compose.yml
    ```

2. **Database connection failed**

    ```bash
    # Check application logs for database connection errors
     docker-compose logs app

     # Test database connectivity to external Supabase database
     docker-compose exec app nc -z aws-0-ap-southeast-1.pooler.supabase.com 6543
 
     # Test database connection via Laravel
     docker-compose exec app php artisan tinker
     # Then run: DB::connection()->getPdo();
     # This will test connection to external Supabase database
    ```

3. **Application not accessible**

    ```bash
    # Check if containers are running
    docker-compose ps

    # Check application logs
    docker-compose logs app
    ```

4. **Nginx/PHP-FPM issues**

    ```bash
    # Restart Nginx
    make restart-nginx

    # Restart PHP-FPM
    make restart-php

    # Restart all services
    make restart-services

    # Check service status
    make status-services
    ```

5. **502 Bad Gateway**

    ```bash
    # Usually indicates PHP-FPM is not running
    make restart-php
    make logs-php
    ```

6. **Permission issues**

    ```bash
    # Fix storage permissions
    sudo chown -R www-data:www-data storage/
    sudo chmod -R 775 storage/
    ```

7. **Application key not set**
    ```bash
    # Generate new application key
    docker-compose exec app php artisan key:generate
    ```

### Health Checks

```bash
# Check application health
curl http://localhost:8082/up

# Check database connection
docker-compose exec app php artisan migrate:status
```

## Security Considerations

1. **Change default passwords** in `.env` file
2. **Use strong JWT secret** (minimum 32 characters)
3. **Enable firewall** and only open necessary ports
4. **Regular updates** of Docker images
5. **Backup database** regularly
6. **Use HTTPS** in production with reverse proxy (Nginx)

## Production Recommendations

### Reverse Proxy Setup

For production, you may want to add an additional Nginx reverse proxy for:

-   SSL termination
-   Load balancing
-   Additional security headers
-   Rate limiting

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

### Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor logs
docker-compose logs -f --tail=100
```

## Support

Jika mengalami masalah:

1. Periksa logs dengan `docker-compose logs`
2. Pastikan semua environment variables sudah benar
3. Periksa dokumentasi Laravel dan Docker
4. Buat issue di repository GitHub

---

**Note**: Pastikan untuk mengganti semua placeholder (your-domain.com, passwords, etc.) dengan nilai yang sesuai untuk environment production Anda.
