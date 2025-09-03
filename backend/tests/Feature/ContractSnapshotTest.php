<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ContractSnapshotTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_index_shape(): void
    {
        Customer::factory()->create(['name' => 'Alice', 'email' => 'alice@example.com']);

        $res = $this->getJson('/api/v1/customers');
        $res->assertOk()
            ->assertJson(fn ($json) => $json
                ->has('data', fn ($json) => $json
                    ->whereType('0.id', 'integer')
                    ->whereType('0.name', 'string')
                    ->whereType('0.email', 'string')
                    ->etc()
                )
                ->hasAll(['links', 'meta'])
            );
    }

    public function test_favorites_index_shape(): void
    {
        $customer = Customer::factory()->create();
        Favorite::factory()->create(['customer_id' => $customer->id, 'product_id' => 101]);

        $res = $this->getJson("/api/v1/customers/{$customer->id}/favorites");
        $res->assertOk()
            ->assertJson(fn ($json) => $json
                ->has('data', fn ($json) => $json
                    ->whereType('0.customer_id', 'integer')
                    ->whereType('0.product_id', 'integer')
                    ->whereType('0.created_at', 'string|null')
                )
                ->hasAll(['links', 'meta'])
            );
    }

    public function test_products_show_shape(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products/7' => Http::response([
                'id' => 7,
                'title' => 'Product',
                'price' => 12.34,
                'description' => 'Lorem',
                'category' => 'cat',
                'image' => 'https://example.com/img.png',
                'rating' => ['rate' => 4.2, 'count' => 10],
            ], 200),
        ]);

        $res = $this->getJson('/api/v1/products/7');
        $res->assertOk()
            ->assertHeader('ETag')
            ->assertJson(fn ($json) => $json
                ->whereType('id', 'integer')
                ->whereType('title', 'string')
                ->whereType('price', 'double|integer')
                ->whereType('description', 'string')
                ->whereType('category', 'string')
                ->whereType('image', 'string')
                ->whereType('rating.rate', 'double|integer')
                ->whereType('rating.count', 'integer')
            );
    }
}
