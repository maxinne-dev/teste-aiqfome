<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:token {email} {--abilities=*}', function (string $email, array $abilities) {
    $user = User::firstOrCreate(['email' => $email], [
        'name' => $email,
        'password' => bcrypt(str()->random(16)),
    ]);

    $token = $user->createToken('cli-issued', $abilities ?: ['products:read'])->plainTextToken;
    $this->info("Token for {$email}: {$token}");
})->purpose('Issue a personal access token with optional abilities');
