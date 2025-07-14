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
        return false;
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
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,pdf,mp4,|max:512000',
            'url_file' => 'nullable|string',
            'public_id' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Judul wajib diisi',
            'content.required' => 'Isi wajib diisi',
            'file.required' => 'File wajib diisi',
            'file.image' => 'File harus berupa gambar',
            'file.mimes' => 'File harus berupa jpeg, png, jpg, gif, svg, pdf, mp4',
            'file.max' => 'File maksimal 512kb',
        ];
    }
}
