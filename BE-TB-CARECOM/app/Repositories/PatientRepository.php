<?php

namespace App\Repositories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;

class PatientRepository
{
    public function __construct(private Patient $model) {}

    public function create(array $data): Patient
    {
        return $this->model->create($data);
    }

    public function getAll(array $filters)
    {
        $query = $this->model->query();

        // Search functionality
        if (isset($filters['search']) && $filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('no_telp', 'like', "%{$search}%")
                    ->orWhereHas('pmo', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('assignedNurse', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('rs', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        // Filter by date range
        if (isset($filters['start_date']) && $filters['start_date'] !== '') {
            $query->whereDate('start_treatment_date', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date']) && $filters['end_date'] !== '') {
            $query->whereDate('start_treatment_date', '<=', $filters['end_date']);
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

        $paginator = $query->with(['assignedNurse', 'pmo'])->paginate($filters['per_page'] ?? 10);
        return $paginator->appends(request()->query());
    }

    public function findById(int $id): ?Patient
    {
        return $this->model->where('id', $id)->first();
    }

     public function update(Patient $patient, array $data): bool
    {
        return $patient->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }
}
