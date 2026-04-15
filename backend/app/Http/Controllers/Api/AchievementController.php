<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AchievementService;
use Illuminate\Http\JsonResponse;

class AchievementController extends Controller
{
    public function __construct(private readonly AchievementService $achievementService) {}

    /**
     * GET /api/users/{user}/achievements
     *
     * Returns the loyalty program summary for a given user.
     */
    public function show(User $user): JsonResponse
    {
        $data = $this->achievementService->getUserAchievementsData($user);

        return response()->json([
            'user' => [
                'id'   => $user->id,
                'name' => $user->name,
            ],
            ...$data,
        ]);
    }
}
