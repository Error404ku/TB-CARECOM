<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Mail\ResetPassword;
use App\Service\PmoService;
use App\Traits\ApiResponse;
use App\Service\UserService;
use Illuminate\Http\Request;
use App\Service\PatientService;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdateRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RequestResetPassword;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\UpdateByAdminRequest;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private UserService $userService,
        private PatientService $patientService,
        private PmoService $pmoService,
    ) {}

    public function register(RegisterRequest $request)
    {
        try {
            $dataUser = [
                'name' => $request->validated('name_pmo'),
                'email' => $request->validated('email'),
                'password' => $request->validated('password'),
                'role' => 'pmo',
            ];
            $user = $this->userService->register($dataUser);
            if (!$user['success']) {
                DB::rollback();
                return $this->error($user['message'], $user['code'], null);
            }

            $dataPatient = [
                'name' => $request->validated('name_patient'),
                'address' => $request->validated('address_patient'),
                'gender' => $request->validated('gender_patient'),
                'no_telp' => $request->validated('no_telp_patient'),
                'start_treatment_date' => $request->validated('start_treatment_date'),
                'assigned_nurse_id' => $request->validated('assigned_nurse_id'),
                'status' => $request->validated('status_patient'),
            ];
            $patient = $this->patientService->create($dataPatient);
            if (!$patient['success']) {
                DB::rollback();
                return $this->error($patient['message'], $patient['code'], null);
            }

            $dataPmo = [
                'patient_id' => $patient['data']->id,
                'user_id' => $user['data']->id,
                'name' => $request->validated('name_pmo'),
                'gender' => $request->validated('gender_pmo'),
                'no_telp' => $request->validated('no_telp_pmo'),
                'relationship' => $request->validated('relationship'),
            ];
            $pmo = $this->pmoService->create($dataPmo);
            if (!$pmo['success']) {
                DB::rollback();
                return $this->error($pmo['message'], $pmo['code'], null);
            }

            DB::commit();
            return $this->success($user['message'], 201, $user['data']);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error('Terjadi kesalahan saat registrasi', 500, null);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data = [
                'email' => $request->validated('email'),
                'password' => $request->validated('password'),
            ];

            $user = $this->userService->login($data);
            if (!$user['success']) {
                return $this->error($user['message'], $user['code'], null);
            }

            return $this->success($user['message'], 200, $user['data'],);
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
        return $this->success('Logout berhasil', 200, []);
    }
    
    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            return $this->success([
                'token' => $token,
                'type' => 'bearer'
            ], 200,'Token berhasil diperbarui');
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat memperbarui token', 400, null);
        }
    }

    public function requestResetPassword(RequestResetPassword $request)
    {
        try {
            $user = $this->userService->GetByEmail($request->email);
            if (!$user['success']) {
                return $this->error($user['message'], $user['code'], null);
            }

            // Create JWT token with custom claims for password reset
            $payload = [
                'user_id' => $user['data']->id,
                'email' => $user['data']->email,
                'purpose' => 'password_reset',
                'exp' => Carbon::now()->addMinutes(60)->timestamp, // 60 minutes expiry
                'iat' => Carbon::now()->timestamp
            ];

            $token = JWTAuth::getJWTProvider()->encode($payload);
            Mail::to($user['data']->email)->send(new ResetPassword($token));

            $updatedUser = $this->userService->update($user['data']->id, ['reset_password' => $token]);
            if (!$updatedUser['success']) {
                return $this->error($updatedUser['message'], $updatedUser['code'], null);
            }

            return $this->success('Permintaan reset password berhasil', 200, null);
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat membuat token reset password', 500, null);
        }
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            // Decode and validate JWT token
            try {
                $payload = JWTAuth::getJWTProvider()->decode($request->reset_token);
            } catch (\Exception $e) {
                return $this->error('Token reset password tidak valid', 400, null);
            }

            // Check if token is for password reset purpose
            if (!isset($payload['purpose']) || $payload['purpose'] !== 'password_reset') {
                return $this->error('Token tidak valid untuk reset password', 400, null);
            }

            // Check if token is expired
            if (isset($payload['exp']) && Carbon::now()->timestamp > $payload['exp']) {
                return $this->error('Token reset password sudah expired', 400, null);
            }

            // Find user by ID from token
            $user = User::find($payload['user_id']);
            if (!$user) {
                return $this->error('User tidak ditemukan', 404, null);
            }

            // Verify email matches
            if ($user->email !== $payload['email']) {
                return $this->error('Token tidak valid untuk user ini', 400, null);
            }

            // Update password
            $user->password = bcrypt($request->password);
            $user->save();

            return $this->success('Password berhasil direset', 200, []);
        } catch (\Exception $e) {
            return $this->error('Terjadi kesalahan saat reset password: ' . $e->getMessage(), 500, null);
        }
    }
}
