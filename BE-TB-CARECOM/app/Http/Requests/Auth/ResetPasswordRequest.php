<?php

namespace App\Http\Requests\Auth;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
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
            'reset_token' => 'required|string',
            'password' => 'required|confirmed|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'reset_token.required' => 'Token reset password harus diisi',
            'reset_token.string' => 'Token reset password harus berupa string',
            'password.required' => 'Password harus diisi',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'password.min' => 'Password minimal 8 karakter',
        ];
    }
}