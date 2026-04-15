<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Achievements are unlocked based on cumulative purchase count.
     *
     * Thresholds: 1, 5, 10, 25, 50 purchases
     */
    public function run(): void
    {
        $achievements = [
            [
                'name'               => 'First Purchase',
                'description'        => 'Made your very first purchase. Welcome to the club!',
                'required_purchases' => 1,
            ],
            [
                'name'               => '5 Purchases',
                'description'        => 'Completed 5 purchases. You\'re getting the hang of this!',
                'required_purchases' => 5,
            ],
            [
                'name'               => '10 Purchases',
                'description'        => 'Reached 10 purchases. You\'re a dedicated shopper!',
                'required_purchases' => 10,
            ],
            [
                'name'               => '25 Purchases',
                'description'        => 'Hit 25 purchases. You\'re a power buyer!',
                'required_purchases' => 25,
            ],
            [
                'name'               => '50 Purchases',
                'description'        => 'Reached 50 purchases. You\'ve achieved legendary status!',
                'required_purchases' => 50,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::firstOrCreate(
                ['name' => $achievement['name']],
                $achievement
            );
        }
    }
}
