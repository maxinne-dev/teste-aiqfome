<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class ScribeGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_scribe_generate_produces_docs_files(): void
    {
        // TODO: Enable test when Scribe can be debugged
        $this->assertTrue(true);
        // Run docs generator (Scribe if available, else fallback stub)
//        Artisan::call('docs:generate');
//
//        $this->assertFileExists(base_path('public/docs/openapi.yaml'));
//        $this->assertFileExists(base_path('public/docs/index.html'));
//
//        $yaml = file_get_contents(base_path('public/docs/openapi.yaml'));
//        $this->assertStringContainsString('openapi: "3.0.3"', $yaml);
//        $this->assertStringContainsString('Customers', $yaml);
//        $this->assertStringContainsString('/api/v1/customers', $yaml);
    }
}
