#!/bin/bash
set -e

# Create necessary directories
mkdir -p /var/log/nginx
mkdir -p /var/log/supervisor
mkdir -p /var/run

# Wait for external database to be ready
echo "Waiting for Supabase database..."
while ! nc -z aws-0-ap-southeast-1.pooler.supabase.com 6543; do
  sleep 1
done
echo "Supabase database is ready!"

# Run Laravel setup commands
echo "Setting up Laravel application..."

# Generate application key if it doesn't exist
if [ ! -f ".env" ] || ! grep -q "APP_KEY=" .env || [ -z "$(grep "APP_KEY=" .env | cut -d'=' -f2)" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Generate JWT secret if it doesn't exist
if [ ! -f ".env" ] || ! grep -q "JWT_SECRET=" .env || [ -z "$(grep "JWT_SECRET=" .env | cut -d'=' -f2)" ]; then
    echo "Generating JWT secret..."
    php artisan jwt:secret --force
fi

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

echo "Laravel application setup completed!"

# Execute the main command
exec "$@"