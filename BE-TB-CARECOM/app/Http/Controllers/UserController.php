<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\CreatePerawat;
use App\Service\UserService;
use App\Traits\ApiResponse;
use App\Service\PmoService;
use App\Service\PatientService;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
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
    
    public function getPerawat(){
        $user = $this->userService->getPerawat();
        if (!$user['success']) {
            return $this->error($user['message'], 400, null);
        }
        return $this->success($user['message'], 201, $user['data']);
    }

    public function getProfile()
    {
        $user = Auth::user();
        return $this->success('Profile berhasil diambil', 200, $user);
    }
}