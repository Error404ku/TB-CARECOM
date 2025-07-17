<?php

namespace App\Service;

use App\Repositories\PatientRepository;
use App\Repositories\DailyMonitoringRepository;
use Illuminate\Support\Facades\Auth;

class DashboardService
{
    public function __construct(
        private DailyMonitoringRepository $dailyMonitoringRepository,
        private PatientRepository $patientRepository,
    ) {}

    public function dashboardPmo(): array
    {
        $dailyMonitoring = $this->dailyMonitoringRepository->countDailyMonitoringByPatientId(Auth::user()->pmo->patient_id);

        return [
            'code' => 200,
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => [
                'patient' => Auth::user()->pmo->patient,
                'daily_monitoring' => $dailyMonitoring,
                'pmo' => Auth::user()->pmo,
                'perawat' => Auth::user()->pmo->patient->assignedNurse,
            ]
        ];
    }

    public function dashboardPerawat():array
    {
        $active = $this->patientRepository->countPatientActive();
        $male = $this->patientRepository->countPatientMale();
        $female = $this->patientRepository->countPatientFemale();

        return [
            'code' => 200,
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => [
                'patient' => [
                    'active' => $active,
                    'male' => $male,
                    'female' => $female,
                ],
            ]
        ];
    }
}
