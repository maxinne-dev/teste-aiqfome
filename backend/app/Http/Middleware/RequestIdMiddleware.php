<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class RequestIdMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $id = $request->headers->get('X-Request-Id') ?: (string) Str::uuid();
        $request->headers->set('X-Request-Id', $id);

        // Expose in response and log context
        $response = $next($request);
        $response->headers->set('X-Request-Id', $id);
        Log::withContext(['request_id' => $id]);

        return $response;
    }
}
