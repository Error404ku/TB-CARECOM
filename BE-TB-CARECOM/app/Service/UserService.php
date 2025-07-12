<?php

namespace App\Services;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

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
                'success' => false,
                'message' => 'Pengguna tidak ditemukan'
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
            'success' => false,
            'message' => 'Password salah'
        ];
    }

    public function register (array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Gagal register'
            ];
        }
        return [
            'success' => true,
            'data' => $user,
            'message' => 'Akun berhasil di register',
        ];
    }

    public function delete(int $id): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User tidak ditemukan'
            ];
        }

        $result = $this->userRepository->delete($id);
        if (!$result) {
            return [
                'success' => false,
                'message' => 'Gagal delete'
            ];
        }
        
        return [
            'success' => true,
            'message' => 'User berhasil dihapus',
        ];
    }
}