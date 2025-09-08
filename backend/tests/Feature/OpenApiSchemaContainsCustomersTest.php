<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class OpenApiSchemaContainsCustomersTest extends TestCase
{
    use RefreshDatabase;

    public function test_openapi_contains_customers_tag_and_paths(): void
    {
        Artisan::call('scribe:generate');

        $yaml = file_get_contents(base_path('public/docs/openapi.yaml'));
        $this->assertStringContainsString('name: "Customers"', $yaml);
        $this->assertStringContainsString('/api/v1/customers', $yaml);
        $this->assertStringContainsString('/api/v1/customers/{id}', $yaml);
    }
}
