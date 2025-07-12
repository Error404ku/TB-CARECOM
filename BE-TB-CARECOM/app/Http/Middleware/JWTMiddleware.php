<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JWTMiddleware extends BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json([
                    'meta' => [
                        'code' => 401,
                        'status' => 'error',
                        'message' => 'User tidak ditemukan'
                    ],
                    'data' => null
                ], 401);
            }
        } catch (TokenExpiredException $e) {
            return response()->json([
                'meta' => [
                    'code' => 401,
                    'status' => 'error',
                    'message' => 'Token telah kedaluwarsa'
                ],
                'data' => null
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'meta' => [
                    'code' => 401,
                    'status' => 'error',
                    'message' => 'Token tidak valid'
                ],
                'data' => null
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'meta' => [
                    'code' => 401,
                    'status' => 'error',
                    'message' => 'Token tidak ditemukan'
                ],
                'data' => null
            ], 401);
        }

        return $next($request);
    }
}