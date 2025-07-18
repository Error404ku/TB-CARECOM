<?php

namespace App\Http\Controllers;

use App\Service\PmoService;
use App\Traits\ApiResponse;
use App\Service\UserService;
use Illuminate\Http\Request;
use App\Service\PatientService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\CreatePerawat;
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
    
    public function getUsers(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'role' => $request->role,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $user = $this->userService->getAll($filters);
        if (!$user['success']) {
            return $this->error($user['message'], $user['code'], null);
        }
        return $this->success($user['message'], 201, $user['data'], $user['pagination'], $user['current_filters']);
    }

    public function getUser(int $id)
    {
        $user = $this->userService->getById($id);
        if (!$user['success']) {
            return $this->error($user['message'], $user['code'], null);
        }
        return $this->success($user['message'], 200, $user['data']);
    }

    public function getPerawat()
    {
        $perawat = $this->userService->getPerawat();
        if (!$perawat['success']) {
            return $this->error($perawat['message'], $perawat['code'], null);
        }
        return $this->success($perawat['message'], 200, $perawat['data']);
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