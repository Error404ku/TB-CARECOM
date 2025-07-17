<?php

namespace App\Http\Controllers;

use App\Service\PmoService;
use App\Traits\ApiResponse;
use App\Service\UserService;
use Illuminate\Http\Request;
use App\Service\DashboardService;
use App\Service\DailyMonitoringService;
use App\Service\EducationalMaterialService;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private PmoService $pmoService,
        private UserService $userService,
        private DailyMonitoringService $dailyMonitoringService,
        private EducationalMaterialService $educationalMaterialService,
        private DashboardService $dashboardService,
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

    public function dashboardPmo()
    {
        $dashboard = $this->dashboardService->dashboardPmo();

        return $this->success('Dashboard pmo', 200, $dashboard);
    }

    public function dashboardPerawat()
    {
        $dashboard = $this->dashboardService->dashboardPerawat();

        return $this->success('Dashboard perawat', 200, $dashboard);
    }
}
