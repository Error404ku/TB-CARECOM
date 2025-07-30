# Laravel Scheduler Setup untuk Patient Monitoring

Dokumentasi ini menjelaskan implementasi Laravel Scheduler untuk melakukan pengecekan rutin status monitoring pasien.

## Overview

Sistem ini menggunakan Laravel Scheduler untuk menjalankan pengecekan harian terhadap pasien yang terlambat melakukan monitoring. Jika pasien tidak submit `daily_monitoring_logs` dalam 24 jam, sistem akan:

1. Reset `start_treatment_date` ke tanggal saat ini (memberikan kesempatan kedua)
2. Menjalankan function PostgreSQL untuk update status

## Komponen yang Dibuat

### 1. Artisan Command
**File:** `app/Console/Commands/CheckPatientTreatmentDates.php`

Command ini menjalankan function PostgreSQL `daily_check_and_reset_treatment_dates()` yang:
- Mencari pasien dengan status 'aktif' yang terlambat monitoring
- Reset `start_treatment_date` ke tanggal saat ini
- Memberikan log hasil operasi

**Cara menjalankan manual:**
```bash
php artisan patients:check-treatment-dates
```

### 2. PostgreSQL Functions
**File:** `database/sql/patient_monitoring_functions.sql`

Berisi beberapa functions:

#### a. `daily_check_and_reset_treatment_dates()`
- Function utama yang dipanggil oleh Laravel command
- Reset `start_treatment_date` untuk pasien yang terlambat
- Return jumlah pasien yang di-update

#### b. `check_patient_monitoring_status()`
- Update status pasien menjadi 'gagal' jika terlambat monitoring
- Digunakan oleh trigger

#### c. `reset_patient_treatment_date()`
- Function untuk trigger yang reset treatment date
- Dipanggil otomatis saat ada insert ke `daily_monitoring_logs`

#### d. Triggers
- `trigger_reset_treatment_date`: Reset treatment date saat ada log baru
- `after_monitoring_insert`: Check status pasien saat ada log baru

### 3. Migration
**File:** `database/migrations/2025_07_30_195559_create_patient_monitoring_functions.php`

- Menambahkan kolom `start_treatment_date` ke tabel `patients`
- Menjalankan SQL functions dari file terpisah
- Rollback yang bersih untuk development

### 4. Scheduler Configuration
**File:** `routes/console.php`

Konfigurasi scheduler:
```php
Schedule::command('patient:check-treatment-dates')
    ->daily()
    ->at('00:00')
    ->description('Check and reset patient treatment dates for late monitoring submissions');
```

## Cara Kerja Sistem

### 1. Pengecekan Harian (00:00)
Setiap hari pada pukul 00:00, Laravel Scheduler akan:
1. Menjalankan command `patients:check-treatment-dates`
2. Command memanggil function PostgreSQL `daily_check_and_reset_treatment_dates()`
3. Function mencari pasien yang terlambat monitoring
4. Reset `start_treatment_date` untuk memberikan kesempatan kedua

### 2. Pengecekan Real-time (Trigger)
Setiap kali ada insert ke `daily_monitoring_logs`:
1. Trigger `trigger_reset_treatment_date` akan reset treatment date jika pasien sebelumnya terlambat
2. Trigger `after_monitoring_insert` akan check status semua pasien

### 3. Kriteria Pasien Terlambat
Pasien dianggap terlambat jika:
- Status = 'aktif' DAN
- Belum pernah submit log DAN sudah lebih dari 24 jam sejak `start_treatment_date`
- ATAU log terakhir lebih dari 24 jam yang lalu

## Setup Production

### 1. Menjalankan Scheduler
Tambahkan cron job di server:
```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Monitoring
Untuk melihat scheduled tasks:
```bash
php artisan schedule:list
```

Untuk test scheduler:
```bash
php artisan schedule:work
```

### 3. Logging
Command akan log hasil ke Laravel log. Check di:
- `storage/logs/laravel.log`
- Atau sesuai konfigurasi logging

## Testing

### 1. Test Manual Command
```bash
php artisan patients:check-treatment-dates
```

### 2. Test Scheduler
```bash
php artisan schedule:test patients:check-treatment-dates
```

### 3. Simulasi Cron
```bash
php artisan schedule:work
```

## Troubleshooting

### 1. Command Tidak Terdaftar
- Pastikan command ada di `app/Console/Commands/`
- Jalankan `php artisan list` untuk verify

### 2. Function PostgreSQL Tidak Ada
- Jalankan migration: `php artisan migrate`
- Check apakah file SQL ada di `database/sql/`

### 3. Scheduler Tidak Jalan
- Pastikan cron job sudah setup di server
- Check `php artisan schedule:list`
- Test dengan `php artisan schedule:work`

### 4. Permission Issues
- Pastikan Laravel bisa write ke storage/logs
- Check database connection

## Kustomisasi

### 1. Mengubah Jadwal
Edit di `routes/console.php`:
```php
// Setiap jam
Schedule::command('patient:check-treatment-dates')->hourly();

// Setiap 30 menit
Schedule::command('patient:check-treatment-dates')->everyThirtyMinutes();

// Custom cron
Schedule::command('patient:check-treatment-dates')->cron('0 */6 * * *');
```

### 2. Mengubah Logic
Edit function di `database/sql/patient_monitoring_functions.sql` dan jalankan ulang migration.

### 3. Menambah Logging
Edit command di `app/Console/Commands/CheckPatientTreatmentDates.php`.

## Security Notes

- Function PostgreSQL menggunakan prepared statements
- Command hanya bisa dijalankan dari CLI
- Tidak ada input user yang langsung ke database
- Logging tidak expose data sensitif pasien

## Performance

- Function PostgreSQL dioptimasi dengan proper indexing
- Command ringan, hanya panggil satu function
- Scheduler Laravel efficient untuk multiple tasks
- Trigger hanya jalan saat ada insert, tidak continuous polling

---

**Catatan:** Dokumentasi ini dibuat untuk Laravel 12.x dengan PostgreSQL. Adjust sesuai versi yang digunakan.