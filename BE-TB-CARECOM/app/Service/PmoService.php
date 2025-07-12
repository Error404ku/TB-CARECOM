<?php

namespace App\Services;

use App\Repositories\PmoRepository;

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
                'success' => false,
                'message' => 'Gagal membuat: ' . $e->getMessage()
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        try {
            $pmo = $this->pmoRepository->update($id, $data);
            
            if (!$pmo) {
                return [
                    'success' => false,
                    'message' => 'PMO tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'PMO berhasil diperbarui',
                'data' => $pmo
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal memperbarui PMO: ' . $e->getMessage()
            ];
        }
    }

    public function delete(int $id): array
    {
        try {
            $result = $this->pmoRepository->delete($id);
            
            if (!$result) {
                return [
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
                    'success' => false,
                    'message' => 'PMO tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'PMO ditemukan',
                'data' => $pmo
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal mendapatkan PMO: ' . $e->getMessage()
            ];
        }
    }

    public function getAll(): array
    {
        try {
            $pmos = $this->pmoRepository->getAll();
            
            return [
                'success' => true,
                'message' => 'Daftar PMO berhasil diambil',
                'data' => $pmos
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal mengambil daftar PMO: ' . $e->getMessage()
            ];
        }
    }

    public function getByPatientId(int $patientId): array
    {
        try {
            $pmos = $this->pmoRepository->getByPatientId($patientId);
            
            return [
                'success' => true,
                'message' => 'Daftar PMO berhasil diambil',
                'data' => $pmos
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal mengambil daftar PMO: ' . $e->getMessage()
            ];
        }
    }
}