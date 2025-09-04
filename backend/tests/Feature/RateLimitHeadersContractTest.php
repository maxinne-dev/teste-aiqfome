<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitHeadersContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_rate_limit_headers_presence_and_shape(): void
    {
        // First hit returns headers with limits and remaining
        $res = $this->getJson('/api/v1/customers');
        $res->assertOk();

        $limit = (int) $res->headers->get('X-RateLimit-Limit');
        $remaining = (int) $res->headers->get('X-RateLimit-Remaining');

        $this->assertGreaterThan(0, $limit);
        $this->assertGreaterThanOrEqual(0, $remaining);

        // Exhaust the window to assert 429 carries Retry-After
        for ($i = 0; $i < $limit; $i++) {
            $this->getJson('/api/v1/customers');
        }

        $blocked = $this->getJson('/api/v1/customers');
        $blocked->assertStatus(429)
            ->assertHeader('Content-Type', 'application/problem+json');

        $retryAfter = (int) $blocked->headers->get('Retry-After');
        $this->assertGreaterThanOrEqual(0, $retryAfter);
    }
}

