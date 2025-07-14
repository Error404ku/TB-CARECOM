<?php

namespace App\Http\Controllers;

use App\Http\Requests\EducationMaterial\CreateEducationMaterial;
use App\Service\EducationalMaterialService;
use App\Traits\ApiResponse;
use Illuminate\Database\QueryException;

class EducationalMaterialController extends Controller
{
    use ApiResponse;

    public function __construct(
        private EducationalMaterialService $educationalMaterialService
    ) {}

    public function createEducationMaterial(CreateEducationMaterial $request)
    {
        $data = [
            'title' => $request->validated('title'),
            'content' => $request->validated('content'),
            'file' => $request->validated('file'),
        ];

        try {
            $data = $request->except('file');
            
            if ($request->hasFile('file')) {
                $uploadedFile = $request->file('file');
                $uploadResult = cloudinary()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'educational_materials'
                ]);
                
                $data['url_file'] = $uploadResult->getSecurePath();
                $data['public_id'] = $uploadResult->getPublicId();
            }
            
            $educationalMaterial = $this->educationalMaterialService->create($data);
            return $this->success($educationalMaterial, 'Educational Material berhasil dibuat', 201);
        } catch (QueryException $e) {
            return $this->error('Gagal membuat Educational Material karena kesalahan database: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return $this->error('Gagal membuat Educational Material: ' . $e->getMessage(), 500);
        }
    }
}