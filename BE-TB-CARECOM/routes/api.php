<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PmoController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/perawat', [AuthController::class, 'createPerawat']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/user/{id}', [AuthController::class, 'delete']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // PMO Routes
    Route::prefix('pmo')->group(function () {
        Route::get('/', [PmoController::class, 'getAll']);
        Route::post('/', [PmoController::class, 'create']);
        Route::get('/patient/{patientId}', [PmoController::class, 'getByPatient']);
        Route::get('/{id}', [PmoController::class, 'getById']);
        Route::put('/{id}', [PmoController::class, 'update']);
        Route::delete('/{id}', [PmoController::class, 'delete']);
    });

    Route::middleware('role:user')->group(function () {
    });
    
    Route::middleware('role:admin')->group(function () {
    });
});

