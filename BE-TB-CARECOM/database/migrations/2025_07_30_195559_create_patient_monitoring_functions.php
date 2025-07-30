<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add start_treatment_date column to patients table if it doesn't exist
        if (!Schema::hasColumn('patients', 'start_treatment_date')) {
            Schema::table('patients', function (Blueprint $table) {
                $table->date('start_treatment_date')->default(DB::raw('CURRENT_DATE'))->after('status');
            });
        }

        // Read and execute the SQL file containing PostgreSQL functions
        $sqlFile = database_path('sql/patient_monitoring_functions.sql');
        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            DB::unprepared($sql);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the functions and triggers
        DB::unprepared('DROP TRIGGER IF EXISTS trigger_reset_treatment_date ON daily_monitoring_logs;');
        DB::unprepared('DROP TRIGGER IF EXISTS after_monitoring_insert ON daily_monitoring_logs;');
        DB::unprepared('DROP FUNCTION IF EXISTS daily_check_and_reset_treatment_dates();');
        DB::unprepared('DROP FUNCTION IF EXISTS check_patient_monitoring_status();');
        DB::unprepared('DROP FUNCTION IF EXISTS reset_patient_treatment_date();');
        DB::unprepared('DROP FUNCTION IF EXISTS trigger_check_patient_status();');
        
        // Remove start_treatment_date column if it exists
        if (Schema::hasColumn('patients', 'start_treatment_date')) {
            Schema::table('patients', function (Blueprint $table) {
                $table->dropColumn('start_treatment_date');
            });
        }
    }
};
