<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\CreatePerawat;
use App\Service\UserService;
use App\Traits\ApiResponse;
use App\Service\PmoService;
use App\Service\PatientService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\UpdateRequest;
use App\Http\Requests\Auth\UpdateByAdminRequest;


class UserController extends Controller
{
    use ApiResponse;
    public function __construct(
        private UserService $userService,
        private PatientService $patientService,
        private PmoService $pmoService,
    ) {}
    public function createPerawat(CreatePerawat $request)
    {
        $user = [
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => $request->validated('password'),
            'rs' => $request->validated('rs'),
            'role' => 'perawat',
        ];

        $user = $this->userService->register($user);
        if (!$user['success']) {
            return $this->error($user['message'], 400, null);
        }
        return $this->success($user['message'], 201, $user['data']);
    }
    
    public function getPerawat(){
        $user = $this->userService->getPerawat();
        if (!$user['success']) {
            return $this->error($user['message'], 400, null);
        }
        return $this->success($user['message'], 201, $user['data']);
    }

    public function getProfile()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return $this->error('User tidak ditemukan', 403);
            }
            return $this->success('Profile berhasil diambil', 200, $user);
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat mengambil profile', 500, null);
        }
    }

    public function update(UpdateRequest $request)
    {   
        $user = $this->userService->update(Auth::user()->id, $request->validated());
        if (!$user['success']) {
            return $this->error($user['message'], $user['code'], null);
        }

        return $this->success($user['message'], 200, $user['data']);
    }

    public function updateByAdmin(int $id, UpdateByAdminRequest $request)
    {
        $user = $this->userService->update($id, $request->validated());
        if (!$user['success']) {
            return $this->error($user['message'], $user['code'], null);
        }

        return $this->success($user['message'], 200, $user['data'],);
    }

    public function delete(int $id)
    {
        if (!Auth::user()->role == 'admin') {
            return $this->error('Anda tidak memiliki akses', 403);
        }

        $user = $this->userService->delete($id);
        if (!$user['success']) {
            return $this->error($user['message'], $user['code'], null);
        }
        return $this->success('User berhasil dihapus', 200, null);
    }
}