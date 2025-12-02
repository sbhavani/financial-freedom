<?php

namespace Modules\Transaction\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CashAccounts\IndexCashAccounts;
use App\Services\CreditCards\IndexCreditCards;
use App\Services\Groups\IndexGroups;
use App\Services\Loans\IndexLoans;
use Modules\Transaction\Services\ImportTransactions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImportController extends Controller
{
    public function index( Request $request ): Response|JsonResponse
    {
        $data = [
            'group' => 'transactions',
            'groups' => fn () => ( new IndexGroups() )->index( $request ),
            'cashAccounts' => fn() => ( new IndexCashAccounts() )->index(),
            'creditCards' => fn() => ( new IndexCreditCards() )->index(),
            'loans' => fn() => ( new IndexLoans() )->index(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'groups' => ( new IndexGroups() )->index( $request ),
                'cashAccounts' => ( new IndexCashAccounts() )->index(),
                'creditCards' => ( new IndexCreditCards() )->index(),
                'loans' => ( new IndexLoans() )->index(),
            ]);
        }

        return Inertia::render('Transactions/Import/Index', $data);
    }

    public function store( Request $request ): RedirectResponse|JsonResponse
    {
        ( new ImportTransactions() )
            ->execute( 
                $request->get('account'),
                $request->get('transactions')
            );

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Transactions imported successfully']);
        }

        return redirect('/transactions');
    }
}
