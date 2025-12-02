<?php

namespace App\Http\Controllers;

use App\Models\CashAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashAccountController extends Controller
{
    public function show( CashAccount $cashAccount ): Response|\Illuminate\Http\JsonResponse
    {
        if (request()->wantsJson()) {
            return response()->json($cashAccount->load('institution'));
        }

        return Inertia::render('CashAccounts/Show', [
            'group' => 'accounts',
            'cashAccount' => $cashAccount,
        ]);
    }

    public function update( Request $request, CashAccount $cashAccount ): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'type' => 'required|string|in:checking,savings,investment,other',
            'balance' => 'numeric',
            'interest_rate' => 'nullable|numeric',
        ]);

        $cashAccount->update($validated);

        if ($request->wantsJson()) {
            return response()->json($cashAccount);
        }
        
        return redirect()->back();
    }

    // public function destroy( Account $account ): RedirectResponse
    // {
    //     ( new DeleteAccount() )->delete( $account );
    //     return redirect()->back();
    // }
}
