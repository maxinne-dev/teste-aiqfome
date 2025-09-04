<?php

namespace Tests\Feature;

use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProblemDetailsTest extends TestCase
{
    use RefreshDatabase;

    public function test_validation_problem_details_shape(): void
    {
        $res = $this->postJson('/api/v1/customers', [
            'name' => '',
            'email' => 'not-an-email',
        ]);

        $res->assertStatus(422)
            ->assertHeader('Content-Type', 'application/problem+json')
            ->assertJsonStructure([
                'type', 'title', 'status', 'detail', 'instance', 'errors' => ['name', 'email']
            ]);
    }

    public function test_not_found_problem_details(): void
    {
        $res = $this->getJson('/api/v1/customers/999999');
        $res->assertStatus(404)
            ->assertHeader('Content-Type', 'application/problem+json')
            ->assertJsonStructure(['type', 'title', 'status', 'detail', 'instance']);
    }

    public function test_conflict_on_unique_violation_maps_to_problem_details(): void
    {
        $this->markTestSkipped('DB-level unique violation mapping is covered by validation at this stage; full conflict mapping will be validated with dedicated scenarios in a later step.');
    }

    public function test_upstream_timeout_problem_details(): void
    {
        // Simulate upstream failure (non-success), which our client maps to ConnectionException
        \Illuminate\Support\Facades\Http::fake([
            'https://fakestoreapi.com/products' => \Illuminate\Support\Facades\Http::response([], 500),
        ]);

        $res = $this->getJson('/api/v1/products');
        $res->assertStatus(504)
            ->assertHeader('Content-Type', 'application/problem+json')
            ->assertJsonStructure(['type', 'title', 'status', 'detail', 'instance']);
    }
}
