<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use App\Services\CreditCards\UpdateCreditCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreditCardController extends Controller
{
    public function show( CreditCard $creditCard ): Response|\Illuminate\Http\JsonResponse
    {
        if (request()->wantsJson()) {
            return response()->json($creditCard->load('institution'));
        }

        return Inertia::render('CreditCards/Show', [
            'group' => 'accounts',
            'creditCard' => $creditCard,
        ]);
    }

    public function update( Request $request, CreditCard $creditCard ): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'brand' => 'required|string',
            'balance' => 'numeric',
            'credit_limit' => 'numeric',
            'interest_rate' => 'nullable|numeric',
            'import_map' => 'nullable|array',
        ]);

        $creditCard->update($request->except(['import_map']));

        if ($request->has('import_map')) {
             ( new UpdateCreditCard( $request, $creditCard ) )->update();
        }

        if ($request->wantsJson()) {
            return response()->json($creditCard);
        }

        return redirect()->back();
    }

    // public function destroy( Account $account ): RedirectResponse
    // {
    //     ( new DeleteAccount() )->delete( $account );
    //     return redirect()->back();
    // }
}
