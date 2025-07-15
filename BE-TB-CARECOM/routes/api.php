<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PmoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DailyMonitoringController;
use App\Http\Controllers\EducationalMaterialController;

//public
Route::post('/daily-monitoring', [DailyMonitoringController::class, 'createDailyMonitoring']);

Route::get('/perawat', [UserController::class, 'getPerawat']);
//auth
Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

//middleware
Route::middleware(['auth:api', 'jwt.verify'])->group(function () {
    // User Routes
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'getProfile']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/', [UserController::class, 'update']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    Route::prefix('educational-material')->group(function () {
        Route::get('/', [EducationalMaterialController::class, 'getAll']);
        Route::get('/{id}', [EducationalMaterialController::class, 'getById']);
    });

    // PMO Routes
    Route::middleware('role:pmo')->group(function () {
        Route::prefix('pmo')->group(function () {
            Route::get('/daily-monitoring', [DailyMonitoringController::class, 'getDailyMonitoringByUser']);
            Route::put('/daily-monitoring', [DailyMonitoringController::class, 'updateDailyMonitoring']);
            Route::prefix('patient')->group(function () {
                Route::get('/', [PatientController::class, 'getByUser']);
                Route::put('/', [PatientController::class, 'update']);
            });
        });
    });

    // Perawat Routes
    Route::middleware('role:perawat')->group(function () {
        Route::prefix('perawat')->group(function () {
            Route::prefix('daily-monitoring')->group(function () {
                Route::get('/{patientId}', [DailyMonitoringController::class, 'getDailyMonitoringByPatientId']);
            });

            Route::prefix('patient')->group(function () {
                Route::get('/', [PatientController::class, 'getByAssignedNurse']);
                Route::get('/{id}', [PatientController::class, 'getById']);
                Route::put('/restart-treatment-date/{id}', [PatientController::class, 'restartTreatmentDate']);
            });
        });
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::prefix('admin')->group(function () {
            Route::prefix('user')->group(function () {
                Route::get('/', [UserController::class, 'getUsers']);
                Route::put('/{id}', [UserController::class, 'updateByAdmin']);
                Route::delete('/{id}', [UserController::class, 'deleteByAdmin']);
                Route::post('/create-perawat', [UserController::class, 'createPerawat']);
            });

            Route::prefix('educational-material')->group(function () {
                Route::post('/', [EducationalMaterialController::class, 'createEducationMaterial']);
                Route::post('/{id}', [EducationalMaterialController::class, 'update']);
                Route::delete('/{id}', [EducationalMaterialController::class, 'delete']);
            });

            Route::prefix('pmo')->group(function () {
                Route::get('/', [PmoController::class, 'getAll']);
                Route::get('/{id}', [PmoController::class, 'getById']);
                Route::get('/patient/{patientId}', [PmoController::class, 'getByPatient']);
                Route::post('/', [PmoController::class, 'create']);
                Route::put('/{id}', [PmoController::class, 'updateByAdmin']);
                Route::delete('/{id}', [PmoController::class, 'delete']);
            });

            Route::prefix('daily-monitoring')->group(function () {
                Route::get('/', [DailyMonitoringController::class, 'getAllDailyMonitoring']);
                Route::get('/{id}', [DailyMonitoringController::class, 'getDailyMonitoring']);
                Route::get('/patient/{patientId}', [DailyMonitoringController::class, 'getDailyMonitoringByPatientId']);
            });

            Route::prefix('patient')->group(function () {
                Route::get('/', [PatientController::class, 'getAll']);
                Route::get('/{id}', [PatientController::class, 'getById']);
                Route::get('/assigned-nurse/{assignedNurseId}', [PatientController::class, 'getByAssignedNurseId']);
                Route::put('/{id}', [PatientController::class, 'updateByAdmin']);
                Route::delete('/{id}', [PatientController::class, 'delete']);
            });
        });
    });
});
