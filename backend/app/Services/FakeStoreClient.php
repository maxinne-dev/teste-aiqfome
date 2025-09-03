<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class FakeStoreClient
{
    private string $baseUrl = 'https://fakestoreapi.com';

    /**
     * @return array<mixed>
     */
    public function listProducts(): array
    {
        $response = Http::baseUrl($this->baseUrl)
            ->retry(3, 200, throw: false)
            ->get('/products');

        if (!$response->successful()) {
            throw new ConnectionException('Failed to fetch products from upstream');
        }

        return $response->json();
    }

    /**
     * @return array<string,mixed>
     */
    public function showProduct(int $id): array
    {
        $response = Http::baseUrl($this->baseUrl)
            ->retry(3, 200, throw: false)
            ->get('/products/'.$id);

        if (!$response->successful()) {
            throw new ConnectionException('Failed to fetch product from upstream');
        }

        return $response->json();
    }
}

