<?php

namespace App\Http\Requests\Auth;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateByAdminRequest extends FormRequest
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
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email',
            'role' => 'nullable|string|in:admin,perawat,pmo',
            'rs' => 'nullable|string'
        ];
    }

    public function messages()
    {
        return [
            'name.string' => 'Nama harus berupa string',
            'email.email' => 'Email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'role.string' => 'Role harus berupa string',
            'role.in' => 'Role harus admin, perawat, atau pmo',
            'rs.required' => 'RS harus diisi',
            'rs.string' => 'RS harus berupa string'
        ];
    }
}
