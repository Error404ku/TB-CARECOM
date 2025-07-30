<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckPatientTreatmentDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'patients:check-treatment-dates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and reset treatment dates for patients who are late with monitoring';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $this->info('Starting patient treatment dates check...');
            
            // Jalankan fungsi PostgreSQL untuk reset treatment dates
            $result = DB::select('SELECT * FROM daily_check_and_reset_treatment_dates()');
            
            if (!empty($result)) {
                $message = $result[0]->message ?? 'Check completed';
                $resetCount = $result[0]->reset_count ?? 0;
                
                $this->info($message);
                
                if ($resetCount > 0) {
                    $this->warn("Reset {$resetCount} patient treatment dates");
                    Log::info("Patient treatment check: Reset {$resetCount} patients", [
                        'reset_count' => $resetCount,
                        'timestamp' => now()
                    ]);
                } else {
                    $this->info('No patients needed treatment date reset');
                    Log::info('Patient treatment check: No resets needed', [
                        'timestamp' => now()
                    ]);
                }
            } else {
                $this->info('Check completed - no results returned');
            }
            
        } catch (\Exception $e) {
            $this->error('Error checking patient treatment dates: ' . $e->getMessage());
            Log::error('Patient treatment check failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'timestamp' => now()
            ]);
            
            return 1; // Exit with error code
        }
        
        return 0; // Success
    }
}
