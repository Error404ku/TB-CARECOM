<?php

namespace App\Repositories;

use App\Models\EducationalMaterial;

class EducationalMaterialRepository
{
    public function create(array $data)
    {
        return EducationalMaterial::create($data);
    }

    public function findById(int $id)
    {
        return EducationalMaterial::find($id);
    }

    public function update(EducationalMaterial $educationalMaterial, array $data)
    {
        $educationalMaterial->update($data);
        return $educationalMaterial;
    }

    public function delete(int $id)
    {
        return EducationalMaterial::destroy($id);
    }

    public function getAll($filters = [])
    {
        $query = EducationalMaterial::query();

        if (isset($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('content', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['sort_by']) && isset($filters['sort_direction'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_direction']);
        }

        return $query->paginate(10);
    }
}