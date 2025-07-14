<?php

namespace App\Service;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
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
}
