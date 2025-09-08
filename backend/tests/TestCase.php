<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // For most feature tests we want product routes to be accessible.
        // AuthAbilitiesTest covers auth scenarios explicitly, so we skip auto-auth there.
        if (static::class !== \Tests\Feature\AuthAbilitiesTest::class) {
            try {
                if (Schema::hasTable('users')) {
                    Sanctum::actingAs(User::factory()->create(), ['products:read']);
                }
            } catch (\Throwable $e) {
                // Skip auto-auth when DB isn't ready
            }
        }
    }
}
