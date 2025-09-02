<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->unsignedBigInteger('product_id');
            $table->timestamps();

            $table->unique(['customer_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

