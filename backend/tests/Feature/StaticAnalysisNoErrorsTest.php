<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class StaticAnalysisNoErrorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_static_analysis_report_has_no_issues(): void
    {
        $code = Artisan::call('code:analyze');
        $this->assertSame(0, $code);

        $reportPath = storage_path('app/analysis-report.json');
        $this->assertFileExists($reportPath);

        $data = json_decode(file_get_contents($reportPath), true);
        $this->assertIsArray($data);
        $this->assertEquals(0, (int)($data['summary']['count'] ?? -1));
    }
}

