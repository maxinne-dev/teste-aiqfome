<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitWriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_write_requests_are_limited_to_20_per_minute(): void
    {
        // First response should include rate limit headers
        $idx = 0;
        $res = $this->postJson('/api/v1/customers', [
            'name' => 'User '.$idx,
            'email' => 'user'.$idx.'@example.com',
        ]);
        $res->assertCreated()->assertHeader('X-RateLimit-Limit');

        for ($idx = 1; $idx < 20; $idx++) {
            $this->postJson('/api/v1/customers', [
                'name' => 'User '.$idx,
                'email' => 'user'.$idx.'@example.com',
            ])->assertCreated();
        }

        $blocked = $this->postJson('/api/v1/customers', [
            'name' => 'Blocked',
            'email' => 'blocked@example.com',
        ]);
        $blocked->assertStatus(429)->assertHeader('Content-Type', 'application/problem+json');
    }
}
