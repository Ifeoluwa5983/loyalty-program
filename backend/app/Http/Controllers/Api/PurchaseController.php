<?php

namespace App\Http\Controllers\Api;

use App\Events\UserMadePurchase;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    /**
     * POST /api/users/{user}/purchases
     *
     * Records a purchase for the user and fires the UserMadePurchase event
     * so the achievements/badges pipeline can run.
     */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'amount'      => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
        ]);

        $purchase = $user->purchases()->create([
            'amount'      => $validated['amount'],
            'description' => $validated['description'] ?? null,
        ]);

        event(new UserMadePurchase($user, $purchase));

        return response()->json([
            'message'    => 'Purchase recorded successfully.',
            'purchase'   => $purchase,
            'total_purchases' => $user->purchases()->count(),
        ], 201);
    }
}
