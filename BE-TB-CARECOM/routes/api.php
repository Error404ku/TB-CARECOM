<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PmoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DailyMonitoringController;
use App\Http\Controllers\EducationalMaterialController;

//public
Route::post('/daily-monitoring', [DailyMonitoringController::class, 'createDailyMonitoring']);

//auth
Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

//middleware
Route::middleware(['auth:api', 'jwt.verify'])->group(function () {
    // User Routes
    Route::prefix('user')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        // Route::delete('/{id}', [AuthController::class, 'delete']);
        Route::put('/', [AuthController::class, 'update']);
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
        });
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::prefix('admin')->group(function () {
            Route::put('/user/{id}', [AuthController::class, 'updateByAdmin']);
            Route::delete('/user/{id}', [AuthController::class, 'deleteByAdmin']);
            Route::post('/create-perawat', [AuthController::class, 'createPerawat']);
            Route::get('/users', [AuthController::class, 'getAll']);

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
                Route::put('/{id}', [PmoController::class, 'update']);
                Route::delete('/{id}', [PmoController::class, 'delete']);
            });

            Route::prefix('daily-monitoring')->group(function () {
                Route::get('/', [DailyMonitoringController::class, 'getAll']);
                Route::get('/{id}', [DailyMonitoringController::class, 'getById']);
                Route::get('/patient/{patientId}', [DailyMonitoringController::class, 'getByPatientId']);
            });
        });
    });
});
