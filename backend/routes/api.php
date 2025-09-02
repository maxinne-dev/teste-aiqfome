<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\FavoriteController;

Route::prefix('v1')->group(function () {
    Route::apiResource('customers', CustomerController::class);
    Route::get('customers/{customer}/favorites', [FavoriteController::class, 'index']);
    Route::post('customers/{customer}/favorites', [FavoriteController::class, 'store']);
    Route::delete('customers/{customer}/favorites/{productId}', [FavoriteController::class, 'destroy']);
});
