<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        try {
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return $this->error('Gagal membuat token', 500);

        }

        return $this->success([
            'token' => $token,
            'user' => $user,
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ], 'Akun berhasil di register', 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return $this->error('Email atau password salah', 401);
            }
        } catch (JWTException $e) {
            return $this->error('Gagal membuat token', 500);
        }

        return $this->success([
            'token' => $token,
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
        ], 'Login berhasil', 200);
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

    public function getUser()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return $this->error('User tidak ditemukan', 404);
            }
            return $this->success($user, 'User berhasil diambil', 200);
        } catch (JWTException $e) {
            return $this->error('Gagal mengambil user', 500);
        }
    }

    public function updateUser(Request $request)
    {
        try {
            $user = Auth::user();
            // $user->update($request->only(['name', 'email']));
            return $this->success($user, 'User berhasil diupdate', 200);
        } catch (JWTException $e) {
            return $this->error('Gagal update user', 500);
        }
    }
}