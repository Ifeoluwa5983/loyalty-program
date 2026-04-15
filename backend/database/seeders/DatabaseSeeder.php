<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed achievements and badges first
        $this->call([
            AchievementSeeder::class,
            BadgeSeeder::class,
        ]);

        // Create demo users for testing
        User::firstOrCreate(
            ['email' => 'alice@example.com'],
            [
                'name'     => 'Alice Johnson',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'name'     => 'Bob Smith',
                'password' => bcrypt('password'),
            ]
        );
    }
}
