<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Badges are unlocked based on the number of achievements earned.
     *
     * Thresholds:
     *   Beginner    → 0 achievements (entry-level badge)
     *   Bronze      → 1 achievement
     *   Silver      → 3 achievements
     *   Gold        → 5 achievements (all achievements unlocked)
     */
    public function run(): void
    {
        $badges = [
            [
                'name'                  => 'Beginner',
                'description'           => 'Every legend starts somewhere. Welcome!',
                'required_achievements' => 0,
            ],
            [
                'name'                  => 'Bronze',
                'description'           => 'You\'ve unlocked your first achievement. Keep going!',
                'required_achievements' => 1,
            ],
            [
                'name'                  => 'Silver',
                'description'           => 'Three achievements down. You\'re on a roll!',
                'required_achievements' => 3,
            ],
            [
                'name'                  => 'Gold',
                'description'           => 'All achievements unlocked. You\'ve mastered the loyalty program!',
                'required_achievements' => 5,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(
                ['name' => $badge['name']],
                $badge
            );
        }
    }
}
