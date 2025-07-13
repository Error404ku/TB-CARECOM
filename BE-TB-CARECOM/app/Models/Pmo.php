<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pmo extends Model
{
    use HasFactory;

    protected $table = 'pmos';

    protected $fillable = [
        'patient_id',
        'user_id',
        'name',
        'no_telp',
        'gender',
        'relationship',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }
}
