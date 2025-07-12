<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'full_name',
        'address',
        'phone_number',
        'start_treatment_date',
        'qr_code_identifier',
        'assigned_nurse_id',
        'status'
    ];

    protected $casts = [
        'start_treatment_date' => 'date',
        'qr_code_identifier' => 'string',
        'status' => 'integer'
    ];

    public function assignedNurse()
    {
        return $this->belongsTo(User::class, 'assigned_nurse_id');
    }

}
