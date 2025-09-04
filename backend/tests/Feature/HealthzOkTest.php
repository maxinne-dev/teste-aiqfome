<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HealthzOkTest extends TestCase
{
    use RefreshDatabase;

    public function test_healthz_ok_shape(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products*' => Http::response([['id' => 1]], 200),
        ]);

        $res = $this->getJson('/healthz');
        $res->assertOk()
            ->assertJson(fn ($json) => $json
                ->where('status', 'ok')
                ->hasAll(['checks.db.status', 'checks.upstream.status', 'checks.redis.status'])
            );
    }
}

