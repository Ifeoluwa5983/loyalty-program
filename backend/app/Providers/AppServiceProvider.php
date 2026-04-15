<?php

namespace App\Providers;

use App\Events\BadgeUnlocked;
use App\Events\UserMadePurchase;
use App\Listeners\ProcessAchievements;
use App\Listeners\ProcessCashback;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // When a user makes a purchase, process achievements and badges
        Event::listen(UserMadePurchase::class, ProcessAchievements::class);

        // When a badge is unlocked, trigger the cashback payment
        Event::listen(BadgeUnlocked::class, ProcessCashback::class);
    }
}
