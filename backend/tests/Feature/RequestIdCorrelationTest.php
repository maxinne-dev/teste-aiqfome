<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class RequestIdCorrelationTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_id_present_in_logs(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products*' => Http::response([['id' => 1]], 200),
        ]);

        Log::spy();

        $res = $this->getJson('/healthz');
        $res->assertOk();

        // Header set by middleware
        $this->assertNotEmpty($res->headers->get('X-Request-Id'));
        // Logger context was enriched
        Log::shouldHaveReceived('withContext')->withArgs(function ($context) {
            return !empty($context['request_id']);
        })->atLeast()->once();
    }
}
