<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CashAccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RulesController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth'])->group( function(){
    Route::get('/', [DashboardController::class, 'index'])
        ->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::post('/rules', [RulesController::class, 'store'])
        ->name('rules.store');

    Route::get('/accounts', [AccountController::class, 'index'])
        ->name('accounts.index');
    // Store route kept here for Inertia forms if needed, but primary API is now in api.php
    // Though for consistency in migration, maybe we should keep them?
    // The request was to move them. But the existing Inertia app might still use them?
    // The prompt implies "Nextjs migration", so eventually this replaces Inertia.
    // For now, I'll comment out the specific routes I moved to api.php to avoid conflict if any,
    // or just leave them if they use different middleware (web vs api/sanctum).
    // Web middleware uses sessions, Sanctum uses tokens (or cookies for SPA).
    // Since we are using Next.js proxy, we rely on Sanctum/Session cookies.
    // Let's keep the WEB routes for the Inertia app (if it still needs to work) and add API routes.
    // However, the PR comment said "Backend has no route for /api/accounts".
    // So simply adding them to api.php is the fix.
    // I will leave web.php mostly as is, but maybe remove the JSON handling expectation from web routes if strictly separating.
    // But `AccountController` handles both `Inertia::render` and `json`.
    // So web routes point to the same controller.
    // The issue is the path `/api/accounts`.
    // If I add them to `routes/api.php`, they will be accessible at `/api/accounts`.

    // I already added them to `routes/api.php`. I will NOT remove them from here to avoid breaking the existing Inertia app during transition, unless instructed to fully replace.
    // The "Route Fix" step is primarily about ensuring `/api/accounts` works.

    Route::post('/accounts', [AccountController::class, 'store'])
        ->name('accounts.store');

    Route::get('/credit-cards/{creditCard}', [CreditCardController::class, 'show'])
        ->name('credit-cards.show');
    Route::put('/credit-cards/{creditCard}', [CreditCardController::class, 'update'])
        ->name('credit-cards.update');

    Route::get('/loans/{loan}', [LoanController::class, 'show'])
        ->name('loans.show');
    Route::put('/loans/{loan}', [LoanController::class, 'update'])
        ->name('loans.update');

    Route::get('/cash-accounts/{cashAccount}', [CashAccountController::class, 'show'])
        ->name('cash-accounts.show');
    Route::put('/cash-accounts/{cashAccount}', [CashAccountController::class, 'update'])
        ->name('cash-accounts.update');
        
    Route::get('/settings', [SettingsController::class, 'index'])
        ->name('settings.index');

    Route::put('/settings/portfolio', [PortfolioController::class, 'update'])
        ->name('settings.portfolio.update');

    Route::get('/settings/categories', [CategoryController::class, 'index'])
        ->name('settings.categories.index');
    Route::post('/settings/categories', [CategoryController::class, 'store'])
        ->name('settings.categories.store');
    Route::put('/settings/categories/{category}', [CategoryController::class, 'update'])
        ->name('settings.categories.update');
    Route::delete('/settings/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('settings.categories.delete');
        
    Route::get('/settings/institutions', [InstitutionController::class, 'index'])
        ->name('settings.institutions.index');
    Route::post('/settings/institutions', [InstitutionController::class, 'store'])
        ->name('settings.institutions.store');
    Route::put('/settings/institutions/{institution}', [InstitutionController::class, 'update'])
        ->name('settings.institutions.update');
    Route::delete('/settings/institutions/{institution}', [InstitutionController::class, 'destroy'])
        ->name('settings.institutions.delete');
    
    
    
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
