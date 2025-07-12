<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalMaterial extends Model
{
    //
    protected $table = 'educational_materials';

    protected $fillable = [
        'title',
        'content',
        'public_id',
        'url_file',
    ];
    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

}
