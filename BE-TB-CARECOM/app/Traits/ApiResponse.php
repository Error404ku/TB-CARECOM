<?php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = [], $message = 'Success', $code = 200, $pagination = null, $currentFilters = null)
    {
        $response = [
            'meta' => [
                'code' => $code,
                'message' => $message
            ],
            'data' => $data
        ];

        if ($pagination) {
            $response['pagination'] = [
                'page' => $pagination['page'] ?? 1,
                'per_page' => $pagination['per_page'] ?? 10,
                'total_items' => $pagination['total_items'] ?? 0,
                'total_pages' => $pagination['total_pages']?? 1
            ];
        }

        if ($currentFilters) {
            $response['current_filters'] = $currentFilters;
        }

        return response()->json($response, $code);
    }

    protected function error($message = 'Error', $code = 400, $data = [])
    {
        return response()->json([
            'meta' => [
                'code' => $code,
                'message' => $message
            ],
            'data' => $data
        ], $code);
    }
}
