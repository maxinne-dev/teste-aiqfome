<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\ProductController;

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('customers', CustomerController::class)->middleware('abilities:customers:*');
    Route::get('customers/{customer}/favorites', [FavoriteController::class, 'index'])->middleware('abilities:favorites:*');
    Route::post('customers/{customer}/favorites', [FavoriteController::class, 'store'])->middleware('abilities:favorites:*');
    Route::delete('customers/{customer}/favorites/{productId}', [FavoriteController::class, 'destroy'])->middleware('abilities:favorites:*');

    Route::get('products', [ProductController::class, 'index'])->middleware('abilities:products:read');
    Route::get('products/{id}', [ProductController::class, 'show'])->middleware('abilities:products:read');
});
