<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:token {email} {--abilities=*}', function (string $email, array $abilities) {
    $user = User::firstOrCreate(['email' => $email], [
        'name' => $email,
        'password' => bcrypt(str()->random(16)),
    ]);

    $token = $user->createToken('cli-issued', $abilities ?: ['products:read'])->plainTextToken;
    $this->info("Token for {$email}: {$token}");
})->purpose('Issue a personal access token with optional abilities');

Artisan::command('scribe:generate', function () {
    $basePath = base_path('public/docs');
    if (!is_dir($basePath)) {
        mkdir($basePath, 0777, true);
    }

    $openapi = [
        'openapi' => '3.0.3',
        'info' => [
            'title' => config('app.name', 'API'),
            'version' => '1.0.0',
        ],
        'tags' => [
            ['name' => 'Customers'],
            ['name' => 'Favorites'],
            ['name' => 'Products'],
            ['name' => 'Auth'],
        ],
        'paths' => [
            '/api/v1/customers' => [
                'get' => ['tags' => ['Customers'], 'summary' => 'List customers', 'responses' => ['200' => ['description' => 'OK']]],
                'post' => ['tags' => ['Customers'], 'summary' => 'Create customer', 'responses' => ['201' => ['description' => 'Created']]],
            ],
            '/api/v1/customers/{id}' => [
                'parameters' => [['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']]],
                'get' => ['tags' => ['Customers'], 'summary' => 'Show customer', 'responses' => ['200' => ['description' => 'OK']]],
                'patch' => ['tags' => ['Customers'], 'summary' => 'Update customer', 'responses' => ['200' => ['description' => 'OK']]],
                'delete' => ['tags' => ['Customers'], 'summary' => 'Delete customer', 'responses' => ['204' => ['description' => 'No Content']]],
            ],
            '/api/v1/customers/{id}/favorites' => [
                'parameters' => [['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']]],
                'get' => ['tags' => ['Favorites'], 'summary' => 'List favorites', 'responses' => ['200' => ['description' => 'OK']]],
                'post' => ['tags' => ['Favorites'], 'summary' => 'Add favorite', 'responses' => ['201' => ['description' => 'Created']]],
            ],
            '/api/v1/customers/{id}/favorites/{productId}' => [
                'parameters' => [
                    ['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']],
                    ['name' => 'productId', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']],
                ],
                'delete' => ['tags' => ['Favorites'], 'summary' => 'Remove favorite', 'responses' => ['204' => ['description' => 'No Content']]],
            ],
            '/api/v1/products' => [
                'get' => [
                    'tags' => ['Products'],
                    'summary' => 'List products',
                    'security' => [['bearerAuth' => []]],
                    'responses' => ['200' => ['description' => 'OK']],
                ],
            ],
            '/api/v1/products/{id}' => [
                'parameters' => [['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']]],
                'get' => [
                    'tags' => ['Products'],
                    'summary' => 'Show product',
                    'security' => [['bearerAuth' => []]],
                    'responses' => ['200' => ['description' => 'OK']],
                ],
            ],
        ],
        'components' => [
            'securitySchemes' => [
                'bearerAuth' => [
                    'type' => 'http',
                    'scheme' => 'bearer',
                ],
            ],
        ],
    ];

    // Simple YAML emitter
    $yaml = function ($data, $indent = 0) use (&$yaml) {
        $out = '';
        foreach ($data as $key => $value) {
            $prefix = str_repeat('  ', $indent);
            if (is_array($value)) {
                if (array_is_list($value)) {
                    $out .= "$prefix$key:\n";
                    foreach ($value as $item) {
                        if (is_array($item)) {
                            $out .= $prefix."  - \n".$yaml($item, $indent + 2);
                        } else {
                            $out .= $prefix."  - ".(is_string($item) ? '"'.str_replace('"','\"',$item).'"' : $item)."\n";
                        }
                    }
                } else {
                    $out .= "$prefix$key:\n".$yaml($value, $indent + 1);
                }
            } else {
                $val = is_string($value) ? '"'.str_replace('"','\"',$value).'"' : ($value === null ? 'null' : ($value ? 'true' : 'false'));
                if (is_numeric($value)) { $val = $value; }
                $out .= "$prefix$key: $val\n";
            }
        }
        return $out;
    };

    file_put_contents($basePath.'/openapi.yaml', $yaml($openapi));

    $html = <<<HTML
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>API Docs</title></head>
<body>
  <h1>API Docs</h1>
  <p>OpenAPI file generated at <code>public/docs/openapi.yaml</code>.</p>
</body></html>
HTML;
    file_put_contents($basePath.'/index.html', $html);

    $this->info('Docs generated: public/docs/index.html, public/docs/openapi.yaml');
})->purpose('Generate API documentation (stub)');
