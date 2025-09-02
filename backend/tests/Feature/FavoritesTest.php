<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoritesTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_empty_state(): void
    {
        $customer = Customer::factory()->create();

        $res = $this->getJson("/api/v1/customers/{$customer->id}/favorites");
        $res->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_create_is_idempotent(): void
    {
        $customer = Customer::factory()->create();

        $create1 = $this->postJson("/api/v1/customers/{$customer->id}/favorites", [
            'product_id' => 123,
        ]);
        $create1->assertStatus(201)->assertJsonPath('data.product_id', 123);

        $create2 = $this->postJson("/api/v1/customers/{$customer->id}/favorites", [
            'product_id' => 123,
        ]);
        $create2->assertStatus(200)->assertJsonPath('data.product_id', 123);

        $this->assertDatabaseCount('favorites', 1);
    }

    public function test_delete_favorite(): void
    {
        $customer = Customer::factory()->create();
        Favorite::factory()->create([
            'customer_id' => $customer->id,
            'product_id' => 555,
        ]);

        $res = $this->deleteJson("/api/v1/customers/{$customer->id}/favorites/555");
        $res->assertNoContent();

        $this->assertDatabaseMissing('favorites', [
            'customer_id' => $customer->id,
            'product_id' => 555,
        ]);
    }
}

