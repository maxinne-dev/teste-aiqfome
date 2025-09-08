<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Throwable;

class HealthController extends Controller
{
    public function __invoke()
    {
        $simulate = request()->query('simulate');

        // DB check
        $db = ['status' => 'ok'];
        try {
            if ($simulate === 'db-fail') {
                throw new \RuntimeException('Simulated DB failure');
            }
            DB::connection()->getPdo();
        } catch (Throwable $e) {
            $db = ['status' => 'fail', 'error' => $e->getMessage()];
        }

        // Redis check (optional in tests)
        $redis = ['status' => 'skip'];
        try {
            if (class_exists(\Illuminate\Support\Facades\Redis::class)) {
                // Only attempt if configured; guard missing extension/services
                Redis::connection()->client('PING');
                $redis = ['status' => 'ok'];
            }
        } catch (Throwable $e) {
            $redis = ['status' => 'fail', 'error' => $e->getMessage()];
        }

        // Upstream (Fake Store) partial ping
        $upstream = ['status' => 'ok'];
        try {
            $res = Http::retry(1, 50, throw: false)
                ->timeout(1)
                ->get('https://fakestoreapi.com/products?limit=1');
            if (! $res->successful()) {
                throw new \RuntimeException('upstream non-200');
            }
        } catch (Throwable $e) {
            $upstream = ['status' => 'fail', 'error' => $e->getMessage()];
        }

        $checks = compact('db', 'redis', 'upstream');
        // Overall considers core dependencies only (DB and Upstream). Redis is optional.
        $core = ['db', 'upstream'];
        $overall = collect($checks)
            ->filter(fn ($_, $k) => in_array($k, $core, true))
            ->every(fn ($c) => ($c['status'] ?? 'ok') !== 'fail') ? 'ok' : 'fail';

        Log::info('healthz', ['status' => $overall, 'checks' => $checks]);

        return response()->json([
            'status' => $overall,
            'checks' => $checks,
        ], $overall === 'ok' ? 200 : 503);
    }
}
