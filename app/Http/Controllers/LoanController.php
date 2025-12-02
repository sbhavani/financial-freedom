<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoanController extends Controller
{
    public function show( Loan $loan ): Response|\Illuminate\Http\JsonResponse
    {
        if (request()->wantsJson()) {
            return response()->json($loan->load('institution'));
        }

        return Inertia::render('Loans/Show', [
            'group' => 'accounts',
            'loan' => $loan,
        ]);
    }

    public function update( Request $request, Loan $loan ): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'original_balance' => 'numeric',
            'remaining_balance' => 'numeric',
            'payment_amount' => 'numeric',
            'interest_rate' => 'nullable|numeric',
            'opened_at' => 'nullable|date',
        ]);

        $loan->update($validated);

        if ($request->wantsJson()) {
            return response()->json($loan);
        }
        
        return redirect()->back();
    }

    // public function destroy( Account $account ): RedirectResponse
    // {
    //     ( new DeleteAccount() )->delete( $account );
    //     return redirect()->back();
    // }
}
