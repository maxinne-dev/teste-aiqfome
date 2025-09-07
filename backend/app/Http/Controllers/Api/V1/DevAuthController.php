<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class DevAuthController extends Controller
{
    /**
     * List users for selection in tools/UIs.
     * If test@example.com exists, flag it as default and put it first.
     */
    public function users(Request $request)
    {
        $users = User::query()
            ->select(['id', 'name', 'email'])
            ->orderBy('email')
            ->get()
            ->toArray();

        $defaultEmail = 'test@example.com';
        $defaultUserId = null;

        // Promote default user to the top and tag it
        usort($users, function ($a, $b) use ($defaultEmail, &$defaultUserId) {
            $aIsDefault = strcasecmp($a['email'], $defaultEmail) === 0;
            $bIsDefault = strcasecmp($b['email'], $defaultEmail) === 0;
            if ($aIsDefault && ! $bIsDefault) {
                return -1;
            }
            if ($bIsDefault && ! $aIsDefault) {
                return 1;
            }

            return strcasecmp($a['email'], $b['email']);
        });

        // Add isDefault flag and compute defaultUserId
        foreach ($users as &$u) {
            $isDefault = strcasecmp($u['email'], $defaultEmail) === 0;
            $u['isDefault'] = $isDefault;
            if ($isDefault) {
                $defaultUserId = $u['id'];
            }
        }
        unset($u);

        return Response::json([
            'users' => $users,
            'default_user_id' => $defaultUserId,
            'default_email' => $defaultEmail,
        ]);
    }

    /**
     * Issue a Sanctum bearer token for a user, mirroring the CLI command
     * `php artisan user:token {email} --abilities=*`.
     * Body: { email: string, abilities?: string | string[] }
     */
    public function issueToken(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            // Accept either a CSV string or an array; we normalize below
            'abilities' => ['nullable'],
        ]);

        $email = $data['email'];
        $inputAbilities = $data['abilities'] ?? null;

        // Normalize abilities: allow array or comma-separated string
        $abilities = null;
        if (is_array($inputAbilities)) {
            $abilities = array_values(array_filter(array_map('strval', $inputAbilities)));
        } elseif (is_string($inputAbilities) && $inputAbilities !== '') {
            $abilities = array_values(array_filter(array_map('trim', explode(',', $inputAbilities))));
        }

        // Special-case admin test user: grant all abilities
        if (strcasecmp($email, 'test@example.com') === 0) {
            $abilities = ['*'];
        }

        // Default ability mirrors the console command behavior
        if (! $abilities || count($abilities) === 0) {
            $abilities = ['products:read'];
        }

        $user = User::firstOrCreate(['email' => $email], [
            'name' => $email,
            'password' => bcrypt(str()->random(16)),
        ]);

        $token = $user->createToken('api-issued', $abilities)->plainTextToken;

        return Response::json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
            'abilities' => $abilities,
        ], 201);
    }
}
