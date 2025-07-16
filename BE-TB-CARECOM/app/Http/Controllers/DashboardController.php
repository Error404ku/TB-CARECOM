<?php

namespace App\Http\Controllers;

use App\Service\PmoService;
use App\Service\UserService;
use Illuminate\Http\Request;
use App\Service\DailyMonitoringService;
use App\Service\EducationalMaterialService;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PmoService $pmoService,
        private UserService $userService,
        private DailyMonitoringService $dailyMonitoringService,
        private EducationalMaterialService $educationalMaterialService,
    ) {}

    public function dashboardAdmin()
    {
        $pmo = $this->pmoService->countPmo();
        $user = $this->userService->countPerawat();
        $dailyMonitoring = $this->dailyMonitoringService->countDailyMonitoring();
        $educationalMaterial = $this->educationalMaterialService->countEducationalMaterial();

        return $this->success('Dashboard admin', 200, [
            'pmo' => $pmo,
            'user' => $user,
            'daily_monitoring' => $dailyMonitoring,
            'educational_material' => $educationalMaterial,
        ]);
    }
}
