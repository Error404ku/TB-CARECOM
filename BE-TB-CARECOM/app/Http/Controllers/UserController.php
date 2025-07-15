<?php

namespace App\Http\Controllers;

use App\Service\PmoService;
use App\Traits\ApiResponse;
use App\Service\UserService;
use Illuminate\Http\Request;
use App\Service\PatientService;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\CreatePerawat;
use App\Http\Requests\Auth\UpdateRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Requests\Auth\RegisterRequest;
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
        return $this->success($user['message'], 201, $user['data']);
    }

    public function getProfile()
    {
        $user = Auth::user();
        return $this->success('Profile berhasil diambil', 200, $user);
    }
}