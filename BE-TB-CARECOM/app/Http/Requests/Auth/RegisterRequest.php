<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\FormRequestTrait;

class RegisterRequest extends FormRequest
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
            'name_pmo' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'gender_pmo' => 'required|in:L,P',
            'no_telp_pmo' => 'required|string|max:13|unique:pmos,no_telp',
            'relationship' => 'required|string|max:255',
            'name_patient' => 'required|string|max:255',
            'address_patient' => 'required|string|max:255',
            'gender_patient' => 'required|in:L,P',
            'no_telp_patient' => 'required|string|max:13|unique:patients,no_telp',
            'start_treatment_date' => 'required|date',
            'assigned_nurse_id' => 'required|integer',
            'status_patient' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name_pmo.required' => 'Nama harus diisi',
            'name_pmo.string' => 'Nama harus berupa string',
            'name_pmo.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email harus diisi',
            'email.email' => 'Email harus berupa email',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password harus diisi',
            'password.string' => 'Password harus berupa string',
            'password.min' => 'Password minimal 8 karakter',
            'gender_pmo.required' => 'Jenis kelamin harus diisi',
            'gender_pmo.in' => 'Jenis kelamin harus berupa L/P',
            'no_telp_pmo.required' => 'Nomor telepon harus diisi',
            'no_telp_pmo.string' => 'Nomor telepon harus berupa string',
            'no_telp_pmo.max' => 'Nomor telepon maksimal 13 karakter',
            'relationship.required' => 'Hubungan harus diisi',
            'relationship.string' => 'Hubungan harus berupa string',
            'relationship.max' => 'Hubungan maksimal 255 karakter',
            'name_patient.required' => 'Nama pasien harus diisi',
            'name_patient.string' => 'Nama pasien harus berupa string',
            'name_patient.max' => 'Nama pasien maksimal 255 karakter',
            'address_patient.required' => 'Alamat pasien harus diisi',
            'address_patient.string' => 'Alamat pasien harus berupa string',
            'address_patient.max' => 'Alamat pasien maksimal 255 karakter',
            'gender_patient.required' => 'Jenis kelamin pasien harus diisi',
            'gender_patient.in' => 'Jenis kelamin pasien harus berupa L/P',
            'no_telp_patient.required' => 'Nomor telepon pasien harus diisi',
            'no_telp_patient.string' => 'Nomor telepon pasien harus berupa string',
            'no_telp_patient.max' => 'Nomor telepon pasien maksimal 13 karakter',
            'start_treatment_date.required' => 'Tanggal mulai perawatan harus diisi',
            'start_treatment_date.date' => 'Tanggal mulai perawatan harus berupa date',
            'assigned_nurse_id.required' => 'Nurse ID harus diisi',
            'assigned_nurse_id.integer' => 'Nurse ID harus berupa integer',
            'status_patient.required' => 'Status pasien harus diisi',
            'status_patient.string' => 'Status pasien harus berupa string',
            'status_patient.max' => 'Status pasien maksimal 255 karakter',
        ];
    }
}
