<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Service\PatientService;
use App\Service\DailyMonitoringService;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\DailyMonitoring\UpdateRequest;
use App\Http\Requests\DailyMonitoring\CreateDailyMonitoring;
use Illuminate\Support\Facades\Auth;

class DailyMonitoringController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PatientService $patientService,
        private DailyMonitoringService $dailyMonitoringService,
    ) {}

    //public
    public function createDailyMonitoring(CreateDailyMonitoring $request) 
    {
        $patientid = $this->patientService->getByQrId($request->qr);
        if (!$patientid['success']) {
            return $this->error($patientid['message'], $patientid['code'], null);
        }

        $data = [
            'patient_id' => $patientid['data']['id'],
            'medication_time' => $request->medication_time,
            'description' => $request->description,
        ];
        $dailyMonitoring = $this->dailyMonitoringService->create($data);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }
        return $this->success($dailyMonitoring['message'], 201, $dailyMonitoring['data']);
    }

    //private
    public function updateDailyMonitoring(UpdateRequest $request)
    {
        $dailyMonitoring = $this->dailyMonitoringService->update(Auth::user()->id, $request->validated());
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

    //private
    public function deleteDailyMonitoring(int $id)
    {
        $dailyMonitoring = $this->dailyMonitoringService->delete($id);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

    //private
    public function getDailyMonitoring(int $id)
    {
        $dailyMonitoring = $this->dailyMonitoringService->getById($id);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

    //private
    public function getAllDailyMonitoring(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $dailyMonitoring = $this->dailyMonitoringService->getAll($filters);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

    //private
    public function getDailyMonitoringByPatientId(int $id, Request $request)
    {
        $filters = [
            'search' => $request->search,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $dailyMonitoring = $this->dailyMonitoringService->getByPatientId($id, $filters);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

    //private
    public function getDailyMonitoringByUser(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->order_by,
            'per_page' => $request->per_page
        ];

        $dailyMonitoring = $this->dailyMonitoringService->getByPatientId(Auth::user()->id, $filters);
        if (!$dailyMonitoring['success']) {
            return $this->error($dailyMonitoring['message'], $dailyMonitoring['code'], null);
        }

        return $this->success($dailyMonitoring['message'], 200, $dailyMonitoring['data']);
    }

}
