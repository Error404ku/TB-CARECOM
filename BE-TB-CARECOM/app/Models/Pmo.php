<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pmo extends Model
{
    use HasFactory;

    protected $table = 'pmos';

    protected $fillable = [
        'user_id',
        'patient_id',
        'name',
        'no_telp',
        'relationship',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
