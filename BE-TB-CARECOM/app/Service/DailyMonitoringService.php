<?php

namespace App\Service;

use App\Models\DailyMonitoringLog;

class DailyMonitoringService
{
    public function create(array $data): DailyMonitoringLog
    {
        return DailyMonitoringLog::create($data);
    }
}