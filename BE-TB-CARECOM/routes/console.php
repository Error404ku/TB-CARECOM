<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule the patient treatment dates check command
Schedule::command('patient:check-treatment-dates')
    ->everyTenMinutes()
    ->description('Check and reset patient treatment dates for late monitoring submissions');
