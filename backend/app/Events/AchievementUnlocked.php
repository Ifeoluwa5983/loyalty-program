<?php

namespace App\Events;

use App\Models\Achievement;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AchievementUnlocked
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Achievement $achievement
    ) {}
}
