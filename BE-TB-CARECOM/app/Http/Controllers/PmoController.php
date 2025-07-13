<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pmo\CreatePmoRequest;
use App\Http\Requests\Pmo\UpdatePmoRequest;
use App\Service\PmoService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class PmoController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PmoService $pmoService,
    ) {}

    public function getAll(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'relationship' => $request->relationship,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];
        
        $result = $this->pmoService->getAll($filters);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['data'], $result['message'], 200, $result['pagination'], $result['current_filters']);
    }

    public function getById($id)
    {
        $result = $this->pmoService->getById($id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['data'], $result['message'], 200);
    }

    public function getByPatient($patientId)
    {
        $result = $this->pmoService->getByPatientId($patientId);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['data'], $result['message'], 200);
    }

    public function create(CreatePmoRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::user()->id;

        $result = $this->pmoService->create($data);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['data'], $result['message'], 201);
    }

    public function update(UpdatePmoRequest $request, $id)
    {
        $data = $request->validated();

        $result = $this->pmoService->update($id, $data);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['data'], $result['message'], 200);
    }

    public function delete($id)
    {
        $result = $this->pmoService->delete($id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success(null, $result['message'], 200);
    }
}