<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ProductsProxyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function test_products_list_cache_hit(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products' => Http::response([
                ['id' => 1, 'title' => 'A'],
                ['id' => 2, 'title' => 'B'],
            ], 200, ['Content-Type' => 'application/json']),
        ]);

        $r1 = $this->getJson('/api/v1/products');
        $r1->assertOk()->assertHeader('ETag');

        $r2 = $this->getJson('/api/v1/products');
        $r2->assertOk();

        Http::assertSentCount(1); // second response served from cache
    }

    public function test_product_show_etag_not_modified(): void
    {
        Http::fake([
            'https://fakestoreapi.com/products/42' => Http::response([
                'id' => 42,
                'title' => 'The Answer',
            ], 200),
        ]);

        $first = $this->get('/api/v1/products/42');
        $etag = $first->headers->get('ETag');
        $this->assertNotEmpty($etag);

        // Send If-None-Match with same ETag
        $second = $this->withHeaders(['If-None-Match' => $etag])->get('/api/v1/products/42');
        $second->assertStatus(304)->assertHeader('ETag', $etag);

        Http::assertSentCount(1); // upstream called only once
    }

    public function test_retry_backoff_on_transient_failure(): void
    {
        $attempts = 0;
        Http::fake(function ($request) use (&$attempts) {
            $attempts++;
            if ($attempts === 1) {
                return Http::response(['error' => 'upstream down'], 500);
            }

            return Http::response([
                ['id' => 1, 'title' => 'Recovered'],
            ], 200);
        });

        $res = $this->getJson('/api/v1/products');
        $res->assertOk()->assertJsonFragment(['title' => 'Recovered']);

        $this->assertTrue($attempts >= 2, 'Expected at least 2 attempts due to retry');
    }
}
