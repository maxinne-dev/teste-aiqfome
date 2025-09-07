<?php

return [
    // Toggle developer/testing auth helper endpoints
    // Routes: /api/v1/dev/users and /api/v1/dev/token
    'dev_auth_routes' => env('FEATURE_DEV_AUTH_ROUTES', false),
];
