<?php

namespace App\Repositories;

use App\Models\Pmo;
use Illuminate\Database\Eloquent\Collection;

class PmoRepository
{
    public function __construct(private Pmo $model) {}

    public function getAll(array $filters)
    {
        $query = $this->model->query();

        // Search functionality
        if (isset($filters['search']) && $filters['search'] !== '') {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('no_telp', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by relationship
        if (isset($filters['relationship']) && $filters['relationship'] !== '') {
            $query->where('relationship', $filters['relationship']);
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

        $paginator = $query->with(['patient', 'user'])->paginate($filters['per_page'] ?? 10);
        return $paginator->appends(request()->query());
    }

    public function create(array $data): Pmo
    {
        return $this->model->create($data);
    }

    public function findById(int $id): ?Pmo
    {
        return $this->model->with(['patient', 'user'])->find($id);
    }

    public function update(Pmo $pmo, array $data): bool
    {
        return $pmo->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    public function getByPatientId(int $patientId): Collection
    {
        return $this->model->where('patient_id', $patientId)->get();
    }
}
