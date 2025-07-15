<?php

namespace App\Http\Requests\DailyMonitoring;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    use FormRequestTrait;
    
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'medication_time' => 'required|date',
            'description' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'medication_time.required' => 'Waktu medikasi wajib diisi',
            'medication_time.date' => 'Waktu medikasi harus berupa tanggal',
            'description.required' => 'Deskripsi wajib diisi',
            'description.string' => 'Deskripsi harus berupa string',
        ];
    }
}
