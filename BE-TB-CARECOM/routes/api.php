<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PmoController;
use App\Http\Controllers\DailyMonitoringController;

//public
Route::post('/daily-monitoring', [DailyMonitoringController::class, 'createDailyMonitoring']);

//auth
Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

//middleware
Route::middleware('auth:api')->group(function () {
    // User Routes
    Route::prefix('user')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::delete('/user/{id}', [AuthController::class, 'delete']);
        Route::put('/user', [AuthController::class, 'update']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
    
    // PMO Routes
    Route::middleware('role:pmo')->group(function () {
        Route::prefix('pmo')->group(function () {
            Route::get('/', [PmoController::class, 'getAll']);
            Route::post('/', [PmoController::class, 'create']);
            Route::get('/patient/{patientId}', [PmoController::class, 'getByPatient']);
            Route::get('/{id}', [PmoController::class, 'getById']);
            Route::put('/{id}', [PmoController::class, 'update']);
            Route::delete('/{id}', [PmoController::class, 'delete']);
        });
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::prefix('admin')->group(function () {
            Route::put('/user/{id}', [AuthController::class, 'updateByAdmin']);
            Route::delete('/user/{id}', [AuthController::class, 'deleteByAdmin']);
            Route::post('/create-perawat', [AuthController::class, 'createPerawat']);
        });
    });
});


