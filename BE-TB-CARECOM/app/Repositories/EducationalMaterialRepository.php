<?php

namespace App\Repositories;

use App\Models\EducationalMaterial;

class EducationalMaterialRepository
{
    public function __construct(private EducationalMaterial $model) {}
    
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function findById(int $id)
    {
        return $this->model->find($id);
    }

    public function update(EducationalMaterial $educationalMaterial, array $data)
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
                $q->where('title', 'like', "%{$search}%");
            });
        }

        $query->orderBy('created_at', 'desc');

        $paginator = $query->paginate($filters['per_page'] ?? 10);
        return $paginator->appends(request()->query());
    }

    public function countAll(): int
    {
        return $this->model->count();
    }
}