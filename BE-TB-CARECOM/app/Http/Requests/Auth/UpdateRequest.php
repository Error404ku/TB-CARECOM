<?php

namespace App\Http\Requests\Auth;

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
            'email' => 'required|string|email|max:255|unique:users,email,' . $this->user,
            'password' => 'nullable|string|min:8',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama harus diisi',
            'name.string' => 'Nama harus berupa string',
            'name.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email harus diisi',
            'email.string' => 'Email harus berupa string',
            'email.email' => 'Email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'email.unique' => 'Email sudah digunakan',
            'password.min' => 'Password minimal 8 karakter',
        ];
    }
}
