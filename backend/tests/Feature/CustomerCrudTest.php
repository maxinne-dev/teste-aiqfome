<?php

namespace Tests\Feature;

use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_empty_list_initially(): void
    {
        $response = $this->getJson('/api/v1/customers');
        $response->assertOk()
            ->assertJson(fn ($json) => $json
                ->has('data')
                ->has('links')
                ->has('meta')
            );
        $this->assertSame(0, $response->json('meta.total'));
    }

    public function test_store_creates_customer_and_returns_201(): void
    {
        $payload = [
            'name' => 'Alice',
            'email' => 'alice@example.com',
        ];

        $response = $this->postJson('/api/v1/customers', $payload);
        $response->assertCreated()
            ->assertHeader('Location')
            ->assertJsonPath('data.name', 'Alice')
            ->assertJsonPath('data.email', 'alice@example.com');

        $this->assertDatabaseHas('customers', ['email' => 'alice@example.com']);
    }

    public function test_duplicate_email_is_rejected_with_422(): void
    {
        Customer::factory()->create(['email' => 'dupe@example.com']);

        $response = $this->postJson('/api/v1/customers', [
            'name' => 'Other',
            'email' => 'DUPE@example.com', // case-insensitive should fail
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_update_customer_and_delete(): void
    {
        $customer = Customer::factory()->create([
            'name' => 'Bob',
            'email' => 'bob@example.com',
        ]);

        $res = $this->patchJson("/api/v1/customers/{$customer->id}", [
            'name' => 'Bobby',
        ]);
        $res->assertOk()->assertJsonPath('data.name', 'Bobby');

        $del = $this->deleteJson("/api/v1/customers/{$customer->id}");
        $del->assertNoContent();

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }
}

