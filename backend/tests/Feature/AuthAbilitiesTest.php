<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Http;

class AuthAbilitiesTest extends TestCase
{
    use RefreshDatabase;

    private function token(array $abilities): string
    {
        $user = User::factory()->create();
        return $user->createToken('test', $abilities)->plainTextToken;
    }

    public function test_unauthorized_without_token(): void
    {
        $res = $this->getJson('/api/v1/products');
        $res->assertStatus(401)->assertHeader('Content-Type', 'application/problem+json');
    }

    public function test_forbidden_without_required_ability(): void
    {
        $token = $this->token(['customers:*']);
        Http::fake(['*' => Http::response([], 200)]);
        $res = $this->withHeader('Authorization', 'Bearer '.$token)->getJson('/api/v1/products');
        $res->assertStatus(403)->assertHeader('Content-Type', 'application/problem+json');
    }

    public function test_allowed_with_correct_ability(): void
    {
        $token = $this->token(['products:read']);
        Http::fake(['*' => Http::response([['id' => 1]], 200)]);
        $res = $this->withHeader('Authorization', 'Bearer '.$token)->getJson('/api/v1/products');
        $res->assertOk();
    }
}
