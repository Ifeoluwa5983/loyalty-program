<?php

namespace App\Listeners;

use App\Events\BadgeUnlocked;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class ProcessCashback implements ShouldQueue
{
    private const CASHBACK_AMOUNT = 300; // Naira

    public function handle(BadgeUnlocked $event): void
    {
        $user = $event->user;
        $badge = $event->badge;

        // --- Mock Payment Provider ---
        // In production, integrate with Paystack, Flutterwave, etc.
        $transactionRef = 'CASHBACK-' . strtoupper(uniqid());

        Log::info('Cashback payment triggered', [
            'transaction_ref' => $transactionRef,
            'user_id'         => $user->id,
            'user_name'       => $user->name,
            'user_email'      => $user->email,
            'badge_unlocked'  => $badge->name,
            'amount_naira'    => self::CASHBACK_AMOUNT,
            'status'          => 'SUCCESS',
            'timestamp'       => now()->toIso8601String(),
        ]);

        // Simulate a slight processing delay and confirm payment
        Log::info("Cashback of ₦" . self::CASHBACK_AMOUNT . " successfully sent to {$user->email} for unlocking the \"{$badge->name}\" badge. Ref: {$transactionRef}");
    }
}
