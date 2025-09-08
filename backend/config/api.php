<?php

return [
    // Named throttle buckets used across the API
    'throttle' => [
        'read' => [
            'name' => 'api-read',
            'per_minute' => env('RATE_LIMIT_READ_PER_MINUTE', 60),
        ],
        'write' => [
            'name' => 'api-write',
            'per_minute' => env('RATE_LIMIT_WRITE_PER_MINUTE', 20),
        ],
    ],
];
