<?php

namespace App\Http\Requests\Patient;

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
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'no_telp' => 'required|string|max:255',
            'diagnose_date' => 'required|date',
            'birth_date' => 'required|date',
            'status' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap harus diisi.',
            'name.string' => 'Nama lengkap harus berupa teks.',
            'address.string' => 'Alamat harus berupa teks.',
            'address.max' => 'Alamat tidak boleh melebihi 255 karakter.',
            'gender.required' => 'Jenis kelamin harus diisi.',
            'gender.string' => 'Jenis kelamin harus berupa teks.',
            'gender.max' => 'Jenis kelamin tidak boleh melebihi 255 karakter.',
            'no_telp.required' => 'Nomor telepon harus diisi.',
            'name.max' => 'Nama lengkap tidak boleh melebihi 255 karakter.',
            'address.required' => 'Alamat harus diisi.',
            'no_telp.string' => 'Nomor telepon harus berupa teks.',
            'no_telp.max' => 'Nomor telepon tidak boleh melebihi 255 karakter.',
            'diagnose_date.required' => 'Tanggal diagnosis harus diisi.',
            'diagnose_date.date' => 'Tanggal diagnosis harus berupa tanggal.',
            'birth_date.required' => 'Tanggal lahir harus diisi.',
            'birth_date.date' => 'Tanggal lahir harus berupa tanggal.',
            'status.required' => 'Status harus diisi.',
            'status.string' => 'Status harus berupa teks.',
            'status.max' => 'Status tidak boleh melebihi 255 karakter.',
        ];
    }
}
