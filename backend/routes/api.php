<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\ProductController;

Route::prefix('v1')->group(function () {
    // Public customers and favorites endpoints (no auth required by tests)
    Route::apiResource('customers', CustomerController::class);
    Route::get('customers/{customer}/favorites', [FavoriteController::class, 'index']);
    Route::post('customers/{customer}/favorites', [FavoriteController::class, 'store']);
    Route::delete('customers/{customer}/favorites/{productId}', [FavoriteController::class, 'destroy']);

    // Products endpoints require token with products:read ability
    Route::get('products', [ProductController::class, 'index'])->middleware(['auth:sanctum', 'abilities:products:read']);
    Route::get('products/{id}', [ProductController::class, 'show'])->middleware(['auth:sanctum', 'abilities:products:read']);
});
