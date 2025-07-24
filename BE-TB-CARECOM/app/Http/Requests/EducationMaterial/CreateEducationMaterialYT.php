<?php

namespace App\Http\Requests\EducationMaterial;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;

class CreateEducationMaterialYT extends FormRequest
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
            'url_file' => 'required|url',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Judul harus diisi',
            'title.string' => 'Judul harus berupa string',
            'title.max' => 'Judul harus kurang dari 255 karakter',
            'content.required' => 'Isi content harus diisi',
            'content.string' => 'Isi content harus berupa string',
            'url_file.required' => 'URL file harus diisi',
            'url_file.url' => 'URL file harus berupa URL',
        ];
    }
}
