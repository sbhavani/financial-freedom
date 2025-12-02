<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/settings/categories', [App\Http\Controllers\CategoryController::class, 'index'])
        ->name('settings.categories.index');
    Route::post('/settings/categories', [App\Http\Controllers\CategoryController::class, 'store'])
        ->name('settings.categories.store');
    Route::put('/settings/categories/{category}', [App\Http\Controllers\CategoryController::class, 'update'])
        ->name('settings.categories.update');
    Route::delete('/settings/categories/{category}', [App\Http\Controllers\CategoryController::class, 'destroy'])
        ->name('settings.categories.delete');
});
