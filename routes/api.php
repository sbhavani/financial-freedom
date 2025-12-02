<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CashAccountController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
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
});
