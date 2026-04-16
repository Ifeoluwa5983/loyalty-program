<?php

namespace App\Listeners;

use App\Events\UserMadePurchase;
use App\Services\AchievementService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessAchievements implements ShouldQueue
{
    public function __construct(private readonly AchievementService $achievementService) {}

    public function handle(UserMadePurchase $event): void
    {
        $this->achievementService->processUserPurchase($event->user);
    }
}
