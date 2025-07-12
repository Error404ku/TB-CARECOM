<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\CreatePerawat;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Traits\ApiResponse;
use App\Services\UserService;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private UserService $userService,
    )
    {}

    public function register(RegisterRequest $request)
    {
        $user = [
            'name'=> $request->validated('name'),
            'email'=> $request->validated('email'),
            'password'=> $request->validated('password'),
        ];

        $user = $this->userService->register($user);
        if (!$user['success']) {
            return $this->error($user['message'], 400, null);
        }
        return $this->success($user['data'], $user['message'], 201);
    }
    public function createPerawat(CreatePerawat $request)
    {
        $user = [
            'name'=> $request->validated('name'),
            'email'=> $request->validated('email'),
            'password'=> $request->validated('password'),
            'rs'=> $request->validated('rs'),
            'role'=> 'perawat',
        ];

        $user = $this->userService->register($user);
        if (!$user['success']) {
            return $this->error($user['message'], 400, null);
        }
        return $this->success($user['data'], $user['message'], 201);
    }

    public function login(LoginRequest $request)
    {
        try {
            $data =[
                'email'=> $request->validated('email'),
                'password'=> $request->validated('password'),
            ];

            $user = $this->userService->login($data);
            if (!$user['success']) {
                return $this->error($user['message'], 401, null);
            }

            return $this->success($user['data'], $user['message'], 200);
            
        } catch (JWTException $e) {
            return $this->error('Gagal membuat token', 500, null);
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat login', 500, null);
        }
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            return $this->error('Gagal logout', 500);
        }

        return $this->success([], 'Logout berhasil', 200);
    }

    public function delete(Request $request)
    {
        if (!Auth::user()->role == 'admin') {
            return $this->error('Anda tidak memiliki akses', 403);
        }

        $user = $user = $this->userService->delete($request->id);
        return $this->success([], 'User berhasil dihapus', 200);
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            return $this->success([
                'token' => $token,
                'type' => 'bearer'
            ], 'Token berhasil diperbarui', 200);
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat memperbarui token', 400, null);
        }
    }


}