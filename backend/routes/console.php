<?php

use App\Models\User;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

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

// Wrapper docs generator. If Scribe is installed, delegates to it; otherwise generates a stub.
Artisan::command('docs:generate', function () {
    if (class_exists(\Knuckles\Scribe\Commands\GenerateDocumentation::class)) {
        $this->info('Using Scribe to generate API documentation...');

        return \Artisan::call('scribe:generate');
    }
    $basePath = base_path('public/docs');
    if (! is_dir($basePath)) {
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
                            $out .= $prefix.'  - '.(is_string($item) ? '"'.str_replace('"', '\"', $item).'"' : $item)."\n";
                        }
                    }
                } else {
                    $out .= "$prefix$key:\n".$yaml($value, $indent + 1);
                }
            } else {
                $val = is_string($value) ? '"'.str_replace('"', '\"', $value).'"' : ($value === null ? 'null' : ($value ? 'true' : 'false'));
                if (is_numeric($value)) {
                    $val = $value;
                }
                $out .= "$prefix$key: $val\n";
            }
        }

        return $out;
    };

    file_put_contents($basePath.'/openapi.yaml', $yaml($openapi));

    $html = <<<'HTML'
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>API Docs</title></head>
<body>
  <h1>API Docs</h1>
  <p>OpenAPI file generated at <code>public/docs/openapi.yaml</code>.</p>
</body></html>
HTML;
    file_put_contents($basePath.'/index.html', $html);

    $this->info('Docs generated: public/docs/index.html, public/docs/openapi.yaml');
})->purpose('Generate API documentation (Scribe if available, fallback stub)');

// Backward-compat alias for environments without Scribe. Only register if Scribe is not present
if (! class_exists(\Knuckles\Scribe\Commands\GenerateDocumentation::class)) {
    Artisan::command('scribe:generate', function () {
        return \Artisan::call('docs:generate');
    })->purpose('Alias to docs:generate when Scribe is not installed');
}

Artisan::command('code:analyze', function () {
    $fs = new Filesystem;
    $root = base_path();
    $dirs = ['app', 'routes', 'tests'];
    $bannedNames = ['dd', 'dump', 'var_dump'];
    $flagExitDie = true; // detect 'exit' and 'die' keywords

    $issues = [];
    foreach ($dirs as $dir) {
        foreach ($fs->allFiles($root.'/'.$dir) as $file) {
            if ($file->getExtension() !== 'php') {
                continue;
            }
            $contents = $fs->get($file->getRealPath());
            $tokens = token_get_all($contents);
            for ($i = 0; $i < count($tokens); $i++) {
                $t = $tokens[$i];
                if (is_array($t)) {
                    [$id, $text] = $t;
                    // Skip strings and comments entirely
                    if (in_array($id, [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true)) {
                        continue;
                    }
                    // exit/die are special keywords
                    if ($flagExitDie && ($id === T_EXIT)) {
                        $issues[] = [
                            'file' => str_replace($root.'/', '', $file->getRealPath()),
                            'issue' => "Forbidden call 'exit/die'",
                        ];

                        continue;
                    }
                    if ($id === T_STRING && in_array($text, $bannedNames, true)) {
                        // Look ahead for '('
                        $j = $i + 1;
                        while ($j < count($tokens) && is_array($tokens[$j]) && in_array($tokens[$j][0], [T_WHITESPACE], true)) {
                            $j++;
                        }
                        if ($j < count($tokens) && $tokens[$j] === '(') {
                            $issues[] = [
                                'file' => str_replace($root.'/', '', $file->getRealPath()),
                                'issue' => "Forbidden call '{$text}('",
                            ];
                        }
                    }
                }
            }
        }
    }

    $report = [
        'issues' => $issues,
        'summary' => [
            'count' => count($issues),
        ],
    ];

    if (! $fs->isDirectory(storage_path('app'))) {
        $fs->makeDirectory(storage_path('app'), 0777, true);
    }
    $fs->put(storage_path('app/analysis-report.json'), json_encode($report, JSON_PRETTY_PRINT));

    $this->info('Analysis complete: storage/app/analysis-report.json');

    return empty($issues) ? 0 : 1;
})->purpose('Run static analysis (lightweight) and write a JSON report');
