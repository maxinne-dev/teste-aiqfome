<?php

use App\Exceptions\ProblemDetails;
use App\Http\Middleware\RequestIdMiddleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Route middleware aliases used by the API
        $middleware->alias([
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);

        // Global middleware for security headers and request id
        $middleware->append(\App\Http\Middleware\SecurityHeadersMiddleware::class);
        $middleware->append(RequestIdMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, $request) {
            $errors = $e->errors();
            $detail = 'One or more validation errors occurred.';

            return ProblemDetails::make($request, 422, 'Unprocessable Content', $detail, 'https://datatracker.ietf.org/doc/html/rfc9110#name-422-unprocessable-content', [
                'errors' => $errors,
            ]);
        });

        $exceptions->render(function (ModelNotFoundException $e, $request) {
            return ProblemDetails::make($request, 404, 'Not Found', 'The requested resource was not found.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-404-not-found');
        });

        $exceptions->render(function (NotFoundHttpException $e, $request) {
            return ProblemDetails::make($request, 404, 'Not Found', 'The requested resource was not found.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-404-not-found');
        });

        $exceptions->render(function (QueryException $e, $request) {
            // Postgres unique_violation: 23505
            $code = (string) $e->getCode();
            $message = (string) $e->getMessage();
            if ($code === '23505' || ($code === '23000' && str_contains(strtolower($message), 'unique'))) {
                return ProblemDetails::make($request, 409, 'Conflict', 'A resource with the same unique attribute already exists.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-409-conflict');
            }

            return null; // defer to default
        });

        $exceptions->render(function (AuthenticationException $e, $request) {
            return ProblemDetails::make($request, 401, 'Unauthorized', 'Authentication is required to access this resource.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-401-unauthorized');
        });

        $exceptions->render(function (AuthorizationException|AccessDeniedHttpException $e, $request) {
            return ProblemDetails::make($request, 403, 'Forbidden', 'You do not have permission to perform this action.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-403-forbidden');
        });

        $exceptions->render(function (ThrottleRequestsException|TooManyRequestsHttpException $e, $request) {
            $response = ProblemDetails::make($request, 429, 'Too Many Requests', 'Rate limit exceeded.', 'https://datatracker.ietf.org/doc/html/rfc6585#section-4');
            if (method_exists($e, 'getHeaders')) {
                foreach ($e->getHeaders() as $k => $v) {
                    $response->headers->set($k, $v);
                }
            }

            return $response;
        });

        $exceptions->render(function (ConnectionException $e, $request) {
            return ProblemDetails::make($request, 504, 'Gateway Timeout', 'Upstream service did not respond in time.', 'https://datatracker.ietf.org/doc/html/rfc9110#name-504-gateway-timeout');
        });
    })->create();
