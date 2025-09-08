<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HealthzDbFailSimulationTest extends TestCase
{
    use RefreshDatabase;

    public function test_healthz_db_fail_simulation(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products*' => Http::response([['id' => 1]], 200),
        ]);

        $res = $this->getJson('/healthz?simulate=db-fail');
        $res->assertStatus(503)
            ->assertJsonPath('status', 'fail')
            ->assertJsonPath('checks.db.status', 'fail');
    }
}
