<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHeadersPresenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_present_on_api_responses(): void
    {
        $res = $this->getJson('/api/v1/customers');
        $res->assertOk();

        $res->assertHeader('X-Content-Type-Options', 'nosniff');
        $res->assertHeader('X-Frame-Options', 'DENY');
        $res->assertHeader('Referrer-Policy', 'no-referrer');
    }
}

