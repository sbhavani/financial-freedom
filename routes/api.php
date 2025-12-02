<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CashAccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\LoanController;
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

// TEMPORARY: Bypass authentication for development
// TODO: Re-enable auth:sanctum middleware once CORS/cookie issues are resolved
Route::get('/user', function (Request $request) {
    // Return a mock user for development
    return [
        'id' => 1,
        'name' => 'Dev User',
        'email' => 'dev@example.com',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ];
});

Route::middleware([\App\Http\Middleware\DevAuthMiddleware::class])->group(function () {
    // Account routes
    Route::get('/accounts', [AccountController::class, 'index'])
        ->name('api.accounts.index');
    Route::post('/accounts', [AccountController::class, 'store'])
        ->name('api.accounts.store');

    Route::get('/credit-cards/{creditCard}', [CreditCardController::class, 'show'])
        ->name('api.credit-cards.show');
    Route::put('/credit-cards/{creditCard}', [CreditCardController::class, 'update'])
        ->name('api.credit-cards.update');

    Route::get('/loans/{loan}', [LoanController::class, 'show'])
        ->name('api.loans.show');
    Route::put('/loans/{loan}', [LoanController::class, 'update'])
        ->name('api.loans.update');

    Route::get('/cash-accounts/{cashAccount}', [CashAccountController::class, 'show'])
        ->name('api.cash-accounts.show');
    Route::put('/cash-accounts/{cashAccount}', [CashAccountController::class, 'update'])
        ->name('api.cash-accounts.update');

    // Category routes
    Route::get('/settings/categories', [CategoryController::class, 'index'])
        ->name('settings.categories.index');
    Route::post('/settings/categories', [CategoryController::class, 'store'])
        ->name('settings.categories.store');
    Route::put('/settings/categories/{category}', [CategoryController::class, 'update'])
        ->name('settings.categories.update');
    Route::delete('/settings/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('settings.categories.delete');
});
