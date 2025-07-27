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
            'file' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,mp4|max:307200',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Judul wajib diisi',
            'title.string' => 'Judul harus berupa string',
            'title.max' => 'Judul maksimal 255 karakter',
            'content.required' => 'Isi wajib diisi',
            'content.string' => 'Isi harus berupa string',
            'file.file' => 'File harus berupa file',
            'file.mimes' => 'File harus berupa jpeg, png, jpg, gif, svg, pdf, mp4',
            'file.max' => 'File maksimal 300 MB',
        ];
    }
}
