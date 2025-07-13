<?php

namespace App\Http\Requests\Pmo;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\FormRequestTrait;

class CreatePmoRequest extends FormRequest
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
            'patient_id' => 'required|exists:patients,id',
            'name' => 'required|string|max:255',
            'no_telp' => 'required|string|max:20|unique:pmos,no_telp',
            'gender' => 'required|in:L,P',
            'relationship' => 'required|string|max:100',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'ID pasien harus diisi',
            'patient_id.exists' => 'Pasien tidak ditemukan',
            'name.required' => 'Nama harus diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 255 karakter',
            'no_telp.required' => 'Nomor telepon harus diisi',
            'no_telp.string' => 'Nomor telepon harus berupa teks',
            'no_telp.max' => 'Nomor telepon maksimal 20 karakter',
            'no_telp.unique' => 'Nomor telepon sudah terdaftar',
            'gender.required' => 'Jenis kelamin harus diisi',
            'gender.in' => 'Jenis kelamin harus berupa L/P',
            'relationship.required' => 'Hubungan harus diisi',
            'relationship.string' => 'Hubungan harus berupa teks',
            'relationship.max' => 'Hubungan maksimal 100 karakter',
        ];
    }
}