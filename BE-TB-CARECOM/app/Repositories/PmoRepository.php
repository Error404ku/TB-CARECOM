<?php

namespace App\Repositories;

use App\Models\Pmo;
use Illuminate\Database\Eloquent\Collection;

class PmoRepository
{
    public function __construct(private Pmo $model) {}

    public function create(array $data): Pmo
    {
        return $this->model->create($data);
    }

    public function findById(int $id): ?Pmo
    {
        return $this->model->find($id);
    }

    public function update(int $id, array $data): ?Pmo
    {
        $pmo = $this->findById($id);
        if (!$pmo) {
            return null;
        }
        
        $pmo->update($data);
        return $pmo->fresh();
    }

    public function delete(int $id): bool
    {
        $pmo = $this->findById($id);
        if (!$pmo) {
            return false;
        }
        
        return $pmo->delete();
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getByPatientId(int $patientId): Collection
    {
        return $this->model->where('patient_id', $patientId)->get();
    }
}