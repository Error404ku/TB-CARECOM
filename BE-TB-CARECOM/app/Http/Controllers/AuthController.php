<?php

namespace App\Http\Controllers;

use App\Service\PmoService;
use App\Traits\ApiResponse;
use App\Service\UserService;
use App\Service\PatientService;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdateRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Requests\Auth\RegisterRequest;
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

    public function delete($id)
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
}
