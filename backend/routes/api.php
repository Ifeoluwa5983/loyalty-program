<?php

use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Loyalty Program API Routes
|--------------------------------------------------------------------------
*/

// User management (for demo/testing)
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);

// Achievements endpoint
Route::get('/users/{user}/achievements', [AchievementController::class, 'show']);

// Purchases endpoint (triggers achievement/badge logic)
Route::post('/users/{user}/purchases', [PurchaseController::class, 'store']);
