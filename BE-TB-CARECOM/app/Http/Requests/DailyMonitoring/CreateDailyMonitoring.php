<?php

namespace App\Http\Requests\DailyMonitoring;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\FormRequestTrait;

class CreateDailyMonitoring extends FormRequest
{    
    use FormRequestTrait;
    public function rules(): array
    {
        return [
            'medication_time' => 'required|date',
            'description' => 'required|string',
            'token' => 'required|string',
        ];
    }
    public function messages(): array
    {
        return [
            'medication_time.required' => 'Wajib Mencantumkan Jam Pengisian Obat',
            'medication_time.date' => 'Wajib Mencantumkan Tanggal Pengisian Obat',
            'description.required' => 'Wajib Mencantumkan Deskripsi Pengisian Obat',
            'description.string' => 'Deskripsi Pengisian Obat Harus Berupa String',
            'token.required' => 'Token wajib diisi',
            'token.string' => 'Token harus berupa string',
        ];
    }
}
