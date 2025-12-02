<?php

namespace App\Http\Controllers;

use App\Http\Requests\Accounts\StoreAccountRequest;
use App\Models\Institution;
use App\Services\Accounts\StoreAccount;
use App\Services\CashAccounts\IndexCashAccounts;
use App\Services\CreditCards\IndexCreditCards;
use App\Services\Loans\IndexLoans;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index( Request $request ): Response|\Illuminate\Http\JsonResponse
    {
        $data = [
            'group' => 'accounts',
            'cashAccounts' => fn() => ( new IndexCashAccounts() )->index(),
            'creditCards' => fn() => ( new IndexCreditCards() )->index(),
            'loans' => fn() => ( new IndexLoans() )->index(),
            'institutions' => fn () => ( Institution::orderBy('name', 'ASC')->get() ),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'cashAccounts' => ( new IndexCashAccounts() )->index(),
                'creditCards' => ( new IndexCreditCards() )->index(),
                'loans' => ( new IndexLoans() )->index(),
                'institutions' => Institution::orderBy('name', 'ASC')->get(),
            ]);
        }

        return Inertia::render('Accounts/Index', $data);
    }

    public function store( StoreAccountRequest $request ): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        ( new StoreAccount() )->store( $request );

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Account created successfully']);
        }

        return redirect()->back();
    }

    // public function destroy( Account $account ): RedirectResponse
    // {
    //     ( new DeleteAccount() )->delete( $account );
    //     return redirect()->back();
    // }
}
