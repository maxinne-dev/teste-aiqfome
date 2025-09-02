<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProblemDetails
{
    /**
     * Create a Problem Details JSON response (RFC 9457).
     *
     * @param array<string,mixed> $extra Additional members (e.g., errors)
     */
    public static function make(Request $request, int $status, string $title, ?string $detail = null, ?string $type = null, array $extra = []): JsonResponse
    {
        $payload = array_merge([
            'type' => $type ?: 'about:blank',
            'title' => $title,
            'status' => $status,
            'detail' => $detail,
            'instance' => $request->fullUrl(),
        ], $extra);

        return response()->json($payload, $status, [
            'Content-Type' => 'application/problem+json',
        ]);
    }
}

