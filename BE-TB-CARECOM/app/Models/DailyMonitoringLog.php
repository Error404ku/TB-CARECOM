<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyMonitoringLog extends Model
{
    //
    protected $table = 'daily_monitoring_logs';
    
    protected $fillable = [
        'patient_id',
        'medication_time',
        'description',
    ];

    
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
