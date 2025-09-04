<?php

return [
    'title' => env('SCRIBE_TITLE', config('app.name', 'API Docs')),
    'description' => env('SCRIBE_DESCRIPTION', 'HTTP API documentation'),
    'routes' => [
        'match' => [
            'prefixes' => ['api/*'],
            'domains' => ['*'],
        ],
    ],
    'type' => 'openapi',
    'openapi' => [
        'version' => '3.0.3',
    ],
];

