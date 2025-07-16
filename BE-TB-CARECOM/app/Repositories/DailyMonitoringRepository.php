<?php

namespace App\Repositories;

use App\Models\DailyMonitoringLog;

class DailyMonitoringRepository
{
    public function __construct(private DailyMonitoringLog $model) {}
    
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function findById(int $id)
    {
        return $this->model->find($id);
    }

    public function update(DailyMonitoringLog $educationalMaterial, array $data)
    {
        return $educationalMaterial->update($data);
    }

    public function delete(int $id)
    {
        return $this->model->destroy($id);
    }

    public function getAll(array $filters)
    {
        $query = $this->model->query();

        // Search functionality
        if (isset($filters['search']) && $filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                ->orWhereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

       // Filter by date range
        if (isset($filters['start_date']) && $filters['start_date'] !== '') {
            $query->whereDate('medication_time', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date']) && $filters['end_date'] !== '') {
            $query->whereDate('medication_time', '<=', $filters['end_date']);
        }

        // Sorting functionality
        if (isset($filters['sort_by']) && $filters['sort_by'] !== '') {
            $sortField = $filters['sort_by'];
            $sortDirection = isset($filters['sort_direction']) && strtolower($filters['sort_direction']) === 'desc' ? 'desc' : 'asc';
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Default sorting by created_at in descending order
            $query->orderBy('created_at', 'desc');
        }

        $paginator = $query->with('patient')->paginate($filters['per_page'] ?? 10);
        return $paginator->appends(request()->query());
    }

    public function getByPatientId(int $patientId, array $filters)
    {
        $query = $this->model->where('patient_id', $patientId);

        // Search functionality
        if (isset($filters['search']) && $filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                ->orWhereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });
        }

       // Filter by date range
        if (isset($filters['start_date']) && $filters['start_date'] !== '') {
            $query->whereDate('medication_time', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date']) && $filters['end_date'] !== '') {
            $query->whereDate('medication_time', '<=', $filters['end_date']);
        }

        // Sorting functionality
        if (isset($filters['sort_by']) && $filters['sort_by'] !== '') {
            $sortField = $filters['sort_by'];
            $sortDirection = isset($filters['sort_direction']) && strtolower($filters['sort_direction']) === 'desc' ? 'desc' : 'asc';
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Default sorting by created_at in descending order
            $query->orderBy('created_at', 'desc');
        }

        $paginator = $query->with('patient')->paginate($filters['per_page'] ?? 10);
        return $paginator->appends(request()->query());
    }

    public function countDailyMonitoring(): int
    {
        return $this->model->whereDate('created_at', now())->count();
    }
}