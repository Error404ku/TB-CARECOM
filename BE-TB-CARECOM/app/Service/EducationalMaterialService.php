<?php

namespace App\Service;

use App\Repositories\EducationalMaterialRepository;

class EducationalMaterialService
{
    public function __construct(
        private EducationalMaterialRepository $educationalMaterialRepository,
    ) {}

    public function create(array $data)
    {
        if (isset($data['file'])) {
            $uploadedFile = $data['file'];
            $uploadResult = cloudinary()->uploadApi()->upload($uploadedFile->getRealPath(), [
                'folder' => 'TB-CARECOM/educational_materials'
            ]);
            
            $data['url_file'] = $uploadResult['secure_url'];
            $data['public_id'] = $uploadResult['public_id'];
        }
        return $this->educationalMaterialRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        $educationalMaterial = $this->educationalMaterialRepository->findById($id);
        if (!$educationalMaterial) {
            throw new \Exception('Educational Material tidak ditemukan');
        }
        return $this->educationalMaterialRepository->update($educationalMaterial, $data);
    }

    public function delete(int $id)
    {
        $result = $this->educationalMaterialRepository->delete($id);
        if (!$result) {
            throw new \Exception('Educational Material tidak ditemukan');
        }
        return true;
    }

    public function getById(int $id)
    {
        $educationalMaterial = $this->educationalMaterialRepository->findById($id);
        if (!$educationalMaterial) {
            throw new \Exception('Educational Material tidak ditemukan');
        }
        return $educationalMaterial;
    }

    public function getAll($filters = [])
    {
        return $this->educationalMaterialRepository->getAll($filters);
    }
}