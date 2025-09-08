<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkflowPresenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_ci_workflow_exists(): void
    {
        $path = base_path('../.github/workflows/ci.yml');
        if (! file_exists($path)) {
            // When running inside backend working dir, base_path('../') points to repo root
            $path = base_path('.github/workflows/ci.yml');
        }
        $this->assertFileExists($path);

        $yaml = file_get_contents($path);
        $this->assertStringContainsString('jobs:', $yaml);
        $this->assertStringContainsString('backend:', $yaml);
        $this->assertStringContainsString('phpunit', $yaml);
    }
}
