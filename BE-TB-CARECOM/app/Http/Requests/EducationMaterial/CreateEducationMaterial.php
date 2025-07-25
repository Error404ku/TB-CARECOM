<?php

namespace App\Http\Requests\EducationMaterial;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\FormRequestTrait;

class CreateEducationMaterial extends FormRequest
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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf,mp4',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Judul wajib diisi',
            'content.required' => 'Isi wajib diisi',
            'file.required' => 'File wajib diisi',
            'file.file' => 'File harus berupa file',
            'file.mimes' => 'File harus berupa jpeg, png, jpg, gif, svg, pdf, mp4',
        ];
    }
}
