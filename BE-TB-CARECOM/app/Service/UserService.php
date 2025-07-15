<?php

namespace App\Service;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\Auth\GetResource;
use App\Http\Resources\Auth\GetAllResource;
use App\Http\Resources\Auth\GetPerawatResource;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
    ) {}


    public function login(array $data): array
    {
        $user = $this->userRepository->findByEmail($data['email']);
        if (!$user) {
            return [
                'code' => 401,
                'success' => false,
                'message' => 'Email atau password salah'
            ];
        }

        if (Hash::check($data['password'], $user['password'])) {
            $token = JWTAuth::fromUser($user);
            return [
                'success' => true,
                'data' => [
                    'token' => $token,
                    'type' => 'bearer',
                ],
                'message' => 'Login berhasil'
            ];
        }

        return [
            'code' => 401,
            'success' => false,
            'message' => 'Email atau password salah'
        ];
    }

    public function register(array $data): array
    {
        try{
            $data['password'] = Hash::make($data['password']);
            $user = $this->userRepository->create($data);
            if (!$user) {
                return [
                    'code' => 400,
                    'success' => false,
                    'message' => 'Gagal register'
                ];
            }
            return [
                'success' => true,
                'data' => $user,
                'message' => 'Akun berhasil di register',
            ];
        }catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal register ' . $e->getMessage()
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'User tidak ditemukan'
            ];
        }
        try {
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user = $this->userRepository->update($user, $data);

            return [
                'success' => true,
                'data' => $user,
                'message' => 'User berhasil di update',
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal update'
            ];
        }
    }

    public function delete(int $id): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'User tidak ditemukan'
            ];
        }

        $result = $this->userRepository->delete($id);
        if (!$result) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Gagal delete'
            ];
        }

        return [
            'success' => true,
            'message' => 'User berhasil dihapus',
        ];
    }

    public function getAll($filters = []): array
    {
        try {
            $users = $this->userRepository->getAll($filters);
            if ($users->isEmpty()) {
                return [
                    'code' => 404,
                    'success' => false,
                    'message' => 'Tidak ada data Patient'
                ];
            }

            // Set pagination data
            $pagination = [
                'page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total_items' => $users->total(),
                'total_pages' => $users->lastPage()
            ];

            // Set current filters untuk response
            $currentFilters = [
                'search' => $filters['search'] ?? '',
                'role' => $filters['role'] ?? '',
                'sort_by' => $filters['sort_by'] ?? '',
                'sort_direction' => $filters['sort_direction'] ?? '',
            ];

            return [
                'success' => true,
                'data' => GetResource::collection($users),
                'message' => 'Data user berhasil diambil',
                'pagination' => $pagination,
                'current_filters' => $currentFilters
            ];
        } catch (\Exception $e) {
            return [
                'code' => 500,
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui user'
            ];
        }
    }

    public function getPerawat()
    {
        $perawat = $this->userRepository->getPerawat();
        if ($perawat->isEmpty()) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'Tidak ada data perawat'
            ];
        }
        return [
            'success' => true,
            'data' => GetPerawatResource::collection($perawat),
            'message' => 'Data perawat berhasil diambil',
        ];
    }

    public function getById(int $id)
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'code' => 404,
                'success' => false,
                'message' => 'User tidak ditemukan'
            ];
        }
        return [
            'success' => true,
            'data' => new GetResource($user),
            'message' => 'Data user berhasil diambil',
        ];
    }
}
