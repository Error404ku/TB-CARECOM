<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'name',
        'address',
        'gender',
        'no_telp',
        'start_treatment_date',
        'diagnose_date',
        'birth_date',
        'qr_code_identifier',
        'assigned_nurse_id',
        'status'
    ];

    protected $casts = [
        'start_treatment_date' => 'date',
        'diagnose_date' => 'date',
        'birth_date' => 'date',
    ];

    protected static function booted(): void
    {
        // Method ini akan dijalankan secara otomatis
        static::creating(function ($patient) {
            // Mengisi kolom 'qr_code_identifier' dengan UUID baru
            $patient->qr_code_identifier = (string) Str::uuid();
        });
    }

    public function assignedNurse()
    {
        return $this->belongsTo(User::class, 'assigned_nurse_id', 'id');
    }

    public function pmo()
    {
        return $this->hasOne(Pmo::class, 'patient_id', 'id');
    }

    public function dailyMonitoringLog()
    {
        return $this->hasMany(DailyMonitoringLog::class, 'patient_id', 'id');
    }
}
