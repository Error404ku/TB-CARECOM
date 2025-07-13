<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PmoController;

Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/user/{id}', [AuthController::class, 'delete']);
    Route::put('/user', [AuthController::class, 'update']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

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


    Route::middleware('role:admin')->group(function () {
        Route::prefix('admin')->group(function () {
            Route::put('/user/{id}', [AuthController::class, 'updateByAdmin']);
        });
    });
});
