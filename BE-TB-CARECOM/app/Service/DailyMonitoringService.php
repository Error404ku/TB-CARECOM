<?php

namespace App\Service;

use App\Repositories\DailyMonitoringRepository;
use App\Http\Resources\DailyMonitoring\GetResource;
use Illuminate\Support\Facades\Auth;

class DailyMonitoringService
{
    public function __construct(
        private DailyMonitoringRepository $dailyMonitoringRepository,
    ) {}
    
    public function create(array $data): array
    {
        try {
            $dailyMonitoring = $this->dailyMonitoringRepository->create($data);
            
            return [
                'success' => true,
                'message' => 'Daily Monitoring berhasil dibuat',
                'data' => $dailyMonitoring
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat Daily Monitoring'
            ];
        }
    }

    public function updateByUser(int $id, array $data): array
    {
        $dailyMonitoring = $this->dailyMonitoringRepository->findById($id);
         if (!$dailyMonitoring) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Daily Monitoring tidak ditemukan'
            ];
        }
        if($dailyMonitoring->patient_id != Auth::user()->pmo->patient_id) {
            return [
                'code' => 403,
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengupdate Daily Monitoring ini'
            ];
        }
        
        try {
            $dailyMonitoring = $this->dailyMonitoringRepository->update($dailyMonitoring, $data);

            return [
                'success' => true,
                'message' => 'Daily Monitoring berhasil diperbarui',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui Daily Monitoring'
            ];
        }
    }

    public function delete(int $id): array
    {
        try {
            $result = $this->dailyMonitoringRepository->delete($id);
            if (!$result) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Daily Monitoring tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Daily Monitoring berhasil dihapus'
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus Daily Monitoring'
            ];
        }
    }

    public function getById(int $id): array
    {
        try {
            $dailyMonitoring = $this->dailyMonitoringRepository->findById($id);
            if (!$dailyMonitoring) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Daily Monitoring tidak ditemukan'
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Daily Monitoring ditemukan',
                'data' => new GetResource($dailyMonitoring)
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil Daily Monitoring'
            ];
        }
    }

    public function getAll($filters = []): array
    {
        try {
            $dailyMonitorings = $this->dailyMonitoringRepository->getAll($filters);
            if($dailyMonitorings->isEmpty()) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Tidak ada data Daily Monitoring'
                ];
            }
            
            // Set pagination data
            $pagination = [
                'page' => $dailyMonitorings->currentPage(),
                'per_page' => $dailyMonitorings->perPage(),
                'total_items' => $dailyMonitorings->total(),
                'total_pages' => $dailyMonitorings->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'start_date' => $filters['start_date'] ?? '',
                'end_date' => $filters['end_date'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetResource::collection($dailyMonitorings),
                'message' => 'Data Daily Monitoring berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil daftar Daily Monitoring'
            ];
        }
    }

    public function getByPatientId(int $patientId, $filters = []): array
    {
        try {
            $dailyMonitorings = $this->dailyMonitoringRepository->getByPatientId($patientId, $filters);
            if($dailyMonitorings->isEmpty()) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Tidak ada data Daily Monitoring'
                ];
            }
            
            // Set pagination data
            $pagination = [
                'page' => $dailyMonitorings->currentPage(),
                'per_page' => $dailyMonitorings->perPage(),
                'total_items' => $dailyMonitorings->total(),
                'total_pages' => $dailyMonitorings->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'start_date' => $filters['start_date'] ?? '',
                'end_date' => $filters['end_date'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetResource::collection($dailyMonitorings),
                'message' => 'Data Daily Monitoring berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil daftar Daily Monitoring'
            ];
        }
    }
}