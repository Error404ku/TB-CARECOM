<?php

namespace App\Service;

use App\Repositories\PatientRepository;
use App\Http\Resources\Patient\GetAllResource;

class PatientService
{
    public function __construct(
        private PatientRepository $patientRepository,
    ) {}

    public function create(array $data)
    {
        try {
            $patient = $this->patientRepository->create($data);
            return [
                'success' => true,
                'message' => 'patient berhasil dibuat',
                'data' => $patient
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        $patient = $this->patientRepository->findById($id);
        if (!$patient) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Patient tidak ditemukan'
            ];
        }
        try {
            $patient = $this->patientRepository->update($patient, $data);

            return [
                'success' => true,
                'message' => 'Patient berhasil diperbarui',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function delete(int $id): array
    {
        try {
            $result = $this->patientRepository->delete($id);
            if (!$result) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Patient tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Patient berhasil dihapus'
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function getById(int $id): array
    {
        try {
            $patient = $this->patientRepository->findById($id);
            if (!$patient) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Patient tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Patient ditemukan',
                'data' => new GetAllResource($patient)
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }


    public function getAll($filters = []): array
    {
        try {
            $patients = $this->patientRepository->getAll($filters);
            if ($patients->isEmpty()) {
                return [
                    'code' => 200,
                    'success' => true,
                    'message' => 'Tidak ada data Patient',
                    'data' => null,
                    'pagination' => null,
                    'current_filters' => null
                ];
            }

            // Set pagination data
            $pagination = [
                'page' => $patients->currentPage(),
                'per_page' => $patients->perPage(),
                'total_items' => $patients->total(),
                'total_pages' => $patients->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'start_date' => $filters['start_date'] ?? '',
                'end_date' => $filters['end_date'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetAllResource::collection($patients),
                'message' => 'Data patient berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function getByAssignedNurseId(int $assignedNurseId, array $filters = []): array
    {
        try {
            $patients = $this->patientRepository->findByAssignedNurseId($assignedNurseId, $filters);
            if ($patients->isEmpty()) {
                return [
                    'code' => 200,
                    'success' => true,
                    'message' => 'Tidak ada data Patient',
                    'data' => null,
                    'pagination' => null,
                    'current_filters' => null
                ];
            }

            // Set pagination data
            $pagination = [
                'page' => $patients->currentPage(),
                'per_page' => $patients->perPage(),
                'total_items' => $patients->total(),
                'total_pages' => $patients->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'start_date' => $filters['start_date'] ?? '',
                'end_date' => $filters['end_date'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetAllResource::collection($patients),
                'message' => 'Data patient berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'.$e->getMessage()
            ];
        }
    }

    public function getByQrId(string $qrId): array
    {
        try {
            $patient = $this->patientRepository->getByQrId($qrId);
            if (!$patient) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Patient tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Patient ditemukan',
                'data' => $patient
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

    public function getQrCode(int $id): array
    {
        try {
            $patient = $this->patientRepository->findById($id);
            if (!$patient) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Patient tidak ditemukan'
                ];
            }

            return [
                'success' => true,
                'message' => 'Patient ditemukan',
                'data' => $patient->qr_code_identifier
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui patient'
            ];
        }
    }

   
}
