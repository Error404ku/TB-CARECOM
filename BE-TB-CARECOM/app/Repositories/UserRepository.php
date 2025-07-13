<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function __construct(private User $model) {}

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return $this->model->where('id', $id)->first();
    }

     public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }
}
