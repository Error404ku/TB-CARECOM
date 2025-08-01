<?php

namespace App\Service;

use App\Repositories\EducationalMaterialRepository;
use App\Http\Resources\EducationalMaterial\GetResource;

class EducationalMaterialService
{
    public function __construct(
        private EducationalMaterialRepository $educationalMaterialRepository,
    ) {}

    public function createYoutubeLink(array $data)
    {
        try {
            $educationalMaterial = $this->educationalMaterialRepository->create($data);
            return [
                'success' => true,
                'message' => 'Educational Material berhasil dibuat',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat Educational Material'
            ];
        }
    }

    public function updateYoutubeLink(int $id, array $data): array
    {
        $educationalMaterial = $this->educationalMaterialRepository->findById($id);
        if (!$educationalMaterial) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Educational Material tidak ditemukan'
            ];
        }
        try {
            $educationalMaterial = $this->educationalMaterialRepository->update($educationalMaterial, $data);
            return [
                'success' => true,
                'message' => 'Educational Material berhasil diupdate',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengupdate Educational Material'
            ];
        }
    }

    public function create(array $data)
    {
        try {
            // Tentukan resource type berdasarkan ekstensi file
            if (isset($data['file'])) {
                $fileExtension = strtolower($data['file']->getClientOriginalExtension());
                $resourceType = $fileExtension === 'pdf' ? 'raw' : 'auto';
                
                $uploadResult = cloudinary()->uploadApi()->upload($data['file']->getRealPath(), [
                    'folder' => 'TB_CareCom/educational_materials',
                    'resource_type' => $resourceType,
                    'format' => $fileExtension,
                    'public_id' => uniqid('edu_material_'),
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto',
                        'compression' => 'low',
                    ]
                ]);
                if (!$uploadResult) {
                    return [
                        'code' => 500,
                        'success' => false,
                        'message' => 'Gagal mengunggah file'
                    ];
                }
                $data['url_file'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            $educationalMaterial = $this->educationalMaterialRepository->create($data);
            if (!$educationalMaterial && isset($data['file'])) {
                cloudinary()->uploadApi()->destroy($data['public_id']);
                return [
                    'code' => 400,
                    'success' => false,
                    'message' => 'Gagal membuat Educational Material'
                ];
            }

            return [
                'success' => true,
                'message' => 'Educational Material berhasil dibuat',
                'data' => $educationalMaterial
            ];
        } catch (\Exception $e) {
            cloudinary()->uploadApi()->destroy($data['public_id']);
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat Educational Material'
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        $educationalMaterial = $this->educationalMaterialRepository->findById($id);
        if (!$educationalMaterial) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Educational Material tidak ditemukan'
            ];
        }
        try {
            if (isset($data['file'])) {
                if ($data['file']) {
                    // Tentukan resource type berdasarkan ekstensi file
                    $fileExtension = strtolower($data['file']->getClientOriginalExtension());
                    $resourceType = $fileExtension === 'pdf' ? 'raw' : 'auto';
                }
                $uploadResult = cloudinary()->uploadApi()->upload($data['file']->getRealPath(), [
                    'folder' => 'TB_CareCom/educational_materials',
                    'resource_type' => $resourceType,
                    'format' => $fileExtension,
                    'public_id' => uniqid('edu_material_'),
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto',
                        'compression' => 'low',
                    ]
                ]);
                if (!$uploadResult) {
                    return [
                        'code' => 500,
                        'success' => false,
                        'message' => 'Gagal mengunggah file'
                    ];
                }

                $data['url_file'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            $educationalMaterialUpdated = $this->educationalMaterialRepository->update($educationalMaterial, $data);
            if (!$educationalMaterialUpdated) {
                if ($data['public_id']) {
                    cloudinary()->uploadApi()->destroy($data['public_id']);
                }
                return [
                    'code' => 400,
                    'success' => false,
                    'message' => 'Gagal memperbarui Educational Material'
                ];
            }

            if ($data['public_id'] && $educationalMaterial->public_id) {
                cloudinary()->uploadApi()->destroy($educationalMaterial->public_id);
            }
            return [
                'success' => true,
                'message' => 'Educational Material berhasil diperbarui',
                'data' => null
            ];
        } catch (\Exception $e) {
            if ($data['public_id']) {
                cloudinary()->uploadApi()->destroy($data['public_id']);
            }
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function delete(int $id): array
    {
        $educationalMaterial = $this->educationalMaterialRepository->findById($id);
        if (!$educationalMaterial) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Educational Material tidak ditemukan'
            ];
        }

        try {
            if ($educationalMaterial->public_id) {
                $image = cloudinary()->uploadApi()->destroy($educationalMaterial->public_id);
                if (!$image) {
                    return [
                        'code' => 400,
                        'success' => false,
                        'message' => 'Gagal menghapus file'
                    ];
                }
            }

            $result = $this->educationalMaterialRepository->delete($id);
            if (!$result) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Educational Material tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Educational Material berhasil dihapus'
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui Educational Material'
            ];
        }
    }

    public function getById(int $id): array
    {
        try {
            $educationalMaterial = $this->educationalMaterialRepository->findById($id);
            if (!$educationalMaterial) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Educational Material tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Educational Material ditemukan',
                'data' => new GetResource($educationalMaterial)
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui Educational Material'
            ];
        }
    }

    public function getAll($filters = []): array
    {
        try {
            $educationalMaterial = $this->educationalMaterialRepository->getAll($filters);
            if ($educationalMaterial->isEmpty()) {
                return [
                    'code' => 200,
                    'success' => true,
                    'message' => 'Tidak ada data Educational Material',
                    'data' => null,
                    'pagination' => null,
                    'current_filters' => null
                ];
            }

            // Set pagination data
            $pagination = [
                'page' => $educationalMaterial->currentPage(),
                'per_page' => $educationalMaterial->perPage(),
                'total_items' => $educationalMaterial->total(),
                'total_pages' => $educationalMaterial->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetResource::collection($educationalMaterial),
                'message' => 'Data Educational Material berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui Educational Material' . $e->getMessage()
            ];
        }
    }

    public function countEducationalMaterial(): int
    {
        return $this->educationalMaterialRepository->countAll();
    }
}
