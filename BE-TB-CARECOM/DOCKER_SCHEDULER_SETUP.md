# Laravel Scheduler Setup untuk Docker Deployment

## Overview
Dokumentasi ini menjelaskan cara menjalankan Laravel Scheduler di dalam container Docker menggunakan Supervisor untuk monitoring pasien TB-CARECOM.

## Konfigurasi yang Telah Ditambahkan

### 1. Supervisor Configuration
File `docker/supervisord.conf` telah diperbarui dengan konfigurasi Laravel Scheduler:

```ini
[program:laravel-scheduler]
command=/bin/bash -c "while true; do php /var/www/html/artisan schedule:run --verbose --no-interaction; sleep 60; done"
directory=/var/www/html
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/supervisor/laravel-scheduler.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=5
```

### 2. Scheduler Task
Scheduler dikonfigurasi untuk menjalankan command `patients:check-treatment-dates` setiap 10 menit:

```php
// routes/console.php
Schedule::command('patients:check-treatment-dates')
    ->everyTenMinutes()
    ->withoutOverlapping()
    ->runInBackground();
```

## Cara Deploy

### 1. Build dan Jalankan Container
```bash
# Build image
docker-compose build

# Jalankan container
docker-compose up -d
```

### 2. Menggunakan Helper Script (Opsional)
Script helper `docker/scheduler-helper.sh` telah disediakan untuk memudahkan management:

```bash
# Deploy lengkap (build + start + test)
./docker/scheduler-helper.sh deploy

# Monitor semua services
./docker/scheduler-helper.sh monitor

# Lihat status scheduler
./docker/scheduler-helper.sh status

# Lihat logs real-time
./docker/scheduler-helper.sh logs

# Test manual
./docker/scheduler-helper.sh test

# Restart scheduler
./docker/scheduler-helper.sh restart
```

### 2. Verifikasi Scheduler Berjalan
```bash
# Cek status supervisor
docker exec -it tb-carecom-app supervisorctl status

# Cek log scheduler
docker exec -it tb-carecom-app tail -f /var/log/supervisor/laravel-scheduler.log

# Cek scheduled tasks
docker exec -it tb-carecom-app php artisan schedule:list
```

### 3. Test Manual Command
```bash
# Test command secara manual
docker exec -it tb-carecom-app php artisan patients:check-treatment-dates
```

## Monitoring dan Troubleshooting

### Log Files
- **Scheduler Log**: `/var/log/supervisor/laravel-scheduler.log`
- **Supervisor Log**: `/var/log/supervisor/supervisord.log`
- **Laravel Log**: `/var/www/html/storage/logs/laravel.log`

### Commands untuk Debugging
```bash
# Masuk ke container
docker exec -it tb-carecom-app bash

# Cek status semua services
supervisorctl status

# Restart scheduler service
supervisorctl restart laravel-scheduler

# Cek log real-time
tail -f /var/log/supervisor/laravel-scheduler.log
```

### Troubleshooting Common Issues

1. **Scheduler tidak berjalan**:
   ```bash
   supervisorctl start laravel-scheduler
   ```

2. **Permission issues**:
   ```bash
   chown -R www-data:www-data /var/www/html/storage
   chmod -R 775 /var/www/html/storage
   ```

3. **Database connection issues**:
   - Pastikan environment variables di `docker-compose.yml` sudah benar
   - Test koneksi database: `php artisan tinker` → `DB::connection()->getPdo()`

## Konfigurasi Production

### Environment Variables
Pastikan environment variables berikut sudah diset dengan benar di `docker-compose.yml`:

```yaml
environment:
  - APP_ENV=production
  - APP_DEBUG=false
  - DB_CONNECTION=pgsql
  - DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
  - DB_PORT=6543
  - DB_DATABASE=postgres
  - DB_USERNAME=postgres.xduwjlxthomxiempuhoh
  - DB_PASSWORD=terbang
```

### Resource Monitoring
- Monitor CPU dan memory usage container
- Set up alerts untuk scheduler failures
- Regular backup database

## Scheduler Workflow

1. **Supervisor** menjalankan Laravel Scheduler setiap menit
2. **Laravel Scheduler** mengecek jadwal dan menjalankan tasks sesuai cron expression
3. **Command `patients:check-treatment-dates`** dijalankan setiap 10 menit
4. **PostgreSQL Function** `daily_check_and_reset_treatment_dates()` dipanggil
5. **Log hasil** disimpan di Laravel log dan supervisor log

## Security Notes

- Scheduler berjalan dengan user `www-data` untuk keamanan
- Log files memiliki rotasi otomatis (max 10MB, 5 backup files)
- Database credentials disimpan sebagai environment variables

## Performance Considerations

- Scheduler interval: 10 menit (dapat disesuaikan)
- Log rotation: otomatis untuk mencegah disk penuh
- Background execution: tidak memblokir request HTTP
- Overlap protection: mencegah multiple instance berjalan bersamaan