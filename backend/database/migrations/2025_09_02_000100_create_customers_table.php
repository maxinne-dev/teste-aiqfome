<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email')->nullable(false);
            $table->timestamps();
        });

        // Convert email to CITEXT for case-insensitive uniqueness (PostgreSQL)
        DB::statement('ALTER TABLE customers ALTER COLUMN email TYPE CITEXT');

        Schema::table('customers', function (Blueprint $table) {
            $table->unique('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};

