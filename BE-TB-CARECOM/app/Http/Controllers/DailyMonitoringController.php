<?php

namespace App\Http\Controllers;

use App\Http\Requests\DailyMonitoring\CreateDailyMonitoring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\ApiResponse;
use App\Service\PatientService;
use App\Service\DailyMonitoringService;

class DailyMonitoringController extends Controller
{   
    use ApiResponse;

    public function __construct(
        private PatientService $patientService,
        private DailyMonitoringService $dailyMonitoringService,
    ){}
    public function createDailyMonitoring(CreateDailyMonitoring $request)
    { 
        try {
            $patientid = $this->patientService->getByQrId($request->qr);
            if (!$patientid) {
                return $this->error($patientid['message'], 400, null);
            }
            $data = [
                'patient_id' => $patientid['data']['id'],
                'medication_time' => $request->medication_time,
                'description' => $request->description,
            ];
            $dailyMonitoring = $this->dailyMonitoringService->create($data);
            return $this->success($dailyMonitoring['message'], 201,$dailyMonitoring['data']);
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500, null);
        }
    }

}
