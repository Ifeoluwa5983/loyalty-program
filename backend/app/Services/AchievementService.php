<?php

namespace App\Services;

use App\Events\AchievementUnlocked;
use App\Events\BadgeUnlocked;
use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;

class AchievementService
{
    /**
     * Process all achievements and badges after a user makes a purchase.
     */
    public function processUserPurchase(User $user): void
    {
        $this->checkAndUnlockAchievements($user);
        $this->checkAndUnlockBadges($user);
    }

    /**
     * Check which achievements the user qualifies for and unlock new ones.
     */
    private function checkAndUnlockAchievements(User $user): void
    {
        $purchaseCount = $user->purchases()->count();
        $eligibleAchievements = Achievement::where('required_purchases', '<=', $purchaseCount)->get();
        $alreadyUnlockedIds = $user->achievements()->pluck('achievements.id');

        foreach ($eligibleAchievements as $achievement) {
            if (!$alreadyUnlockedIds->contains($achievement->id)) {
                $user->achievements()->attach($achievement->id, [
                    'unlocked_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                event(new AchievementUnlocked($user, $achievement));
            }
        }
    }

    /**
     * Check which badges the user qualifies for and unlock new ones.
     */
    private function checkAndUnlockBadges(User $user): void
    {
        $achievementCount = $user->achievements()->count();
        $eligibleBadges = Badge::where('required_achievements', '<=', $achievementCount)->get();
        $alreadyUnlockedIds = $user->badges()->pluck('badges.id');

        foreach ($eligibleBadges as $badge) {
            if (!$alreadyUnlockedIds->contains($badge->id)) {
                $user->badges()->attach($badge->id, [
                    'unlocked_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                event(new BadgeUnlocked($user, $badge));
            }
        }
    }

    /**
     * Build the achievements summary payload for the API response.
     */
    public function getUserAchievementsData(User $user): array
    {
        $allAchievements = Achievement::orderBy('required_purchases')->get();
        $unlockedAchievementNames = $user->achievements()->pluck('name')->toArray();

        $nextAvailableAchievements = $allAchievements
            ->filter(fn ($a) => !in_array($a->name, $unlockedAchievementNames))
            ->pluck('name')
            ->values()
            ->toArray();

        $allBadges = Badge::orderBy('required_achievements')->get();
        $unlockedAchievementCount = count($unlockedAchievementNames);

        // Highest badge whose threshold the user has met
        $currentBadge = $allBadges
            ->filter(fn ($b) => $b->required_achievements <= $unlockedAchievementCount)
            ->last();

        // Lowest badge whose threshold the user hasn't met yet
        $nextBadge = $allBadges
            ->filter(fn ($b) => $b->required_achievements > $unlockedAchievementCount)
            ->first();

        return [
            'unlocked_achievements'          => $unlockedAchievementNames,
            'next_available_achievements'    => $nextAvailableAchievements,
            'current_badge'                  => $currentBadge?->name ?? 'None',
            'next_badge'                     => $nextBadge?->name,
            'remaining_to_unlock_next_badge' => $nextBadge
                ? $nextBadge->required_achievements - $unlockedAchievementCount
                : 0,
        ];
    }
}
