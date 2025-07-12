<?php

namespace App\Services;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;

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

        if ($user->status == 0) {
            return [
                'success' => false,
                'message' => 'Pengguna belum membayar uang pendaftaran'
            ];
        }

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
}