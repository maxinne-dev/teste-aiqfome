<?php

use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\DevAuthController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Read endpoints (no auth required by tests)
    Route::get('customers', [CustomerController::class, 'index'])->middleware('throttle:api-read');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->middleware('throttle:api-read');
    Route::get('customers/{customer}/favorites', [FavoriteController::class, 'index'])->middleware('throttle:api-read');

    // Write endpoints
    Route::post('customers', [CustomerController::class, 'store'])->middleware('throttle:api-write');
    Route::patch('customers/{customer}', [CustomerController::class, 'update'])->middleware('throttle:api-write');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->middleware('throttle:api-write');
    Route::post('customers/{customer}/favorites', [FavoriteController::class, 'store'])->middleware('throttle:api-write');
    Route::delete('customers/{customer}/favorites/{productId}', [FavoriteController::class, 'destroy'])->middleware('throttle:api-write');

    // Products endpoints require token with products:read ability and are read-only
    Route::get('products', [ProductController::class, 'index'])->middleware(['auth:sanctum', 'abilities:products:read', 'throttle:api-read']);
    Route::get('products/{id}', [ProductController::class, 'show'])->middleware(['auth:sanctum', 'abilities:products:read', 'throttle:api-read']);

    // Dev helpers: list users and issue tokens (for local testing)
    if (config('features.dev_auth_routes')) {
        Route::get('dev/users', [DevAuthController::class, 'users'])->middleware('throttle:api-read');
        Route::post('dev/token', [DevAuthController::class, 'issueToken'])->middleware('throttle:api-write');
    }
});
