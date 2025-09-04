<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('X-XSS-Protection', '0');

        // Additional modern security headers (safe defaults)
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-site');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        // Note: HSTS typically only for HTTPS; omitted to avoid issues in local HTTP dev

        return $response;
    }
}
