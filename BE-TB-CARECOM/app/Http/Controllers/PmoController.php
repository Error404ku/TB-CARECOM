<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pmo\CreatePmoRequest;
use App\Http\Requests\Pmo\UpdatePmoRequest;
use App\Services\PmoService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;



class PmoController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PmoService $pmoService,
    )
    {}

    public function getAll()
    {
        $result = $this->pmoService->getAll();
        if (!$result['success']) {
            return $this->error($result['message'], 400, null);
        }
        return $this->success($result['data'], $result['message'], 200);
    }

    public function create(CreatePmoRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::user()->id;
        $result = $this->pmoService->create($data);
        if (!$result['success']) {
            return $this->error($result['message'], 400, null);
        }

        return $this->success($result['data'], $result['message'], 201);
    }

    public function getById($id)
    {
        $result = $this->pmoService->getById($id);
        if (!$result['success']) {
            return $this->error($result['message'], 404, null);
        }
        return $this->success($result['data'], $result['message'], 200);
    }

    public function update(UpdatePmoRequest $request, $id)
    {
        $data = $request->validated();
        $result = $this->pmoService->update($id, $data);

        if (!$result['success']) {
            return $this->error($result['message'], 400, null);
        }

        return $this->success($result['data'], $result['message'], 200);
    }

    public function delete($id)
    {
        $result = $this->pmoService->delete($id);
        if (!$result['success']) {
            return $this->error($result['message'], 400, null);
        }
        return $this->success([], $result['message'], 200);
    }

    public function getByPatient($patientId)
    {
        $result = $this->pmoService->getByPatientId($patientId);
        if (!$result['success']) {
            return $this->error($result['message'], 400, null);
        }
        return $this->success($result['data'], $result['message'], 200);
    }
}