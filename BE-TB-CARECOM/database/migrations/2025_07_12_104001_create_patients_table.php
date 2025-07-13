<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->char('gender', 1);
            $table->string('no_telp', 20)->unique();
            $table->date('start_treatment_date');
            $table->uuid('qr_code_identifier')->unique();
            $table->foreignId('assigned_nurse_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
