<?php

namespace App\Service;

use App\Repositories\PmoRepository;
use App\Http\Resources\Pmo\GetAllResource;

class PmoService
{
    public function __construct(
        private PmoRepository $pmoRepository,
    ) {}

    public function create(array $data): array
    {
        try {
            $pmo = $this->pmoRepository->create($data);
            
            return [
                'success' => true,
                'message' => 'PMO berhasil dibuat',
                'data' => $pmo
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal membuat PMO: ' . $e->getMessage()
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        $pmo = $this->pmoRepository->findByUsertId($id);
         if (!$pmo) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'PMO tidak ditemukan'
            ];
        }
        try {
            $pmo = $this->pmoRepository->update($pmo, $data);

            return [
                'success' => true,
                'message' => 'PMO berhasil diperbarui',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui PMO'
            ];
        }
    }

    public function updateByAdmin(int $id, array $data): array
    {
        $pmo = $this->pmoRepository->findById($id);
         if (!$pmo) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'PMO tidak ditemukan'
            ];
        }
        try {
            $pmo = $this->pmoRepository->update($pmo, $data);

            return [
                'success' => true,
                'message' => 'PMO berhasil diperbarui',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui PMO'
            ];
        }
    }
    public function delete(int $id): array
    {
        try {
            $result = $this->pmoRepository->delete($id);
            if (!$result) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'PMO tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'PMO berhasil dihapus'
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal menghapus PMO: ' . $e->getMessage()
            ];
        }
    }

    public function getById(int $id): array
    {
        try {
            $pmo = $this->pmoRepository->findById($id);
            if (!$pmo) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'PMO tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'PMO ditemukan',
                'data' => new GetAllResource($pmo)
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal mendapatkan PMO: ' . $e->getMessage()
            ];
        }
    }

    public function getAll($filters = []): array
    {
        try {
            $pmos = $this->pmoRepository->getAll($filters);
            if($pmos->isEmpty()) {
                return [
                    'code' => 200,
                    'success' => true,
                    'message' => 'Tidak ada data PMO',
                    'data' => null,
                    'pagination' => null,
                    'current_filters' => null
                ];
            }
            
            // Set pagination data
            $pagination = [
                'page' => $pmos->currentPage(),
                'per_page' => $pmos->perPage(),
                'total_items' => $pmos->total(),
                'total_pages' => $pmos->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'relationship' => $filters['relationship'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetAllResource::collection($pmos),
                'message' => 'Data PMO berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal mengambil daftar PMO: ' . $e->getMessage()
            ];
        }
    }

    public function getByPatientId(int $patientId): array
    {
        try {
            $pmos = $this->pmoRepository->getByPatientId($patientId);
            if($pmos->isEmpty()) {
                return [
                    'code' => 200,
                    'success' => true,
                    'message' => 'Tidak ada data PMO',
                    'data' => null,
                    'pagination' => null,
                    'current_filters' => null
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Daftar PMO berhasil diambil',
                'data' => $pmos
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal mengambil daftar PMO: ' . $e->getMessage()
            ];
        }
    }

    public function countPmo(): int
    {
        return $this->pmoRepository->countAll();
    }
}