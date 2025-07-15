<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Service\PatientService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Patient\CreateRequest;
use App\Http\Requests\Patient\UpdateRequest;
use App\Http\Requests\Patient\UpdateAdminRequest;

class PatientController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PatientService $patientService,
    ) {}

    public function getAll(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $result = $this->patientService->getAll($filters);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, $result['data'], $result['pagination'], $result['current_filters']);
    }

    public function getByAssignedNurseId(int $assignedNurseId, Request $request)
    {
        $filters = [
            'search' => $request->search,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $result = $this->patientService->getByAssignedNurseId($assignedNurseId, $filters);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, $result['data'], $result['pagination'], $result['current_filters']);
    }

    public function getByAssignedNurse(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $result = $this->patientService->getByAssignedNurseId(Auth::user()->id, $filters);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, $result['data'], $result['pagination'], $result['current_filters']);
    }

    public function getById($id)
    {
        $result = $this->patientService->getById($id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, $result['data']);
    }

    public function getByUser(){
        $result = $this->patientService->getById(Auth::user()->pmo->patient_id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, $result['data']);
    }

    public function update(UpdateRequest $request)
    {
        $result = $this->patientService->update(Auth::user()->pmo->patient_id, $request->validated());
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['message'], 200, $result['data']);
    }

    public function restartTreatmentDate(int $id)
    {
        $data = [
            'start_treatment_date' => now(),
        ];

        $result = $this->patientService->update($id, $data);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['message'], 200, $result['data']);
    }

    public function updateByAdmin(UpdateAdminRequest $request, int $id)
    {
        $result = $this->patientService->update($id, $request->validated());
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }

        return $this->success($result['message'], 200, $result['data']);
    }

    public function delete($id)
    {
        $result = $this->patientService->delete($id);
        if (!$result['success']) {
            return $this->error($result['message'], $result['code'], null);
        }
        return $this->success($result['message'], 200, null);
    }
}
