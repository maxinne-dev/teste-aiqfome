<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitReadTest extends TestCase
{
    use RefreshDatabase;

    public function test_read_requests_are_limited_to_60_per_minute(): void
    {
        // First response should include rate limit headers
        $first = $this->getJson('/api/v1/customers');
        $first->assertOk()->assertHeader('X-RateLimit-Limit');

        // Exhaust the limit
        for ($i = 0; $i < 59; $i++) {
            $this->getJson('/api/v1/customers')->assertOk();
        }

        // One more should hit the limiter
        $blocked = $this->getJson('/api/v1/customers');
        $blocked->assertStatus(429)->assertHeader('Content-Type', 'application/problem+json');
    }
}

