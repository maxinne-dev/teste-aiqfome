<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Scribe translations namespace
        $this->app['translator']->addNamespace('scribe', base_path('vendor/knuckleswtf/scribe/lang'));
        
        // API rate limiting policies (configurable)
        $read = config('api.throttle.read');
        $write = config('api.throttle.write');

        RateLimiter::for($read['name'], function (Request $request) use ($read) {
            $key = optional($request->user())->id ?: $request->ip();

            return [Limit::perMinute((int) $read['per_minute'])->by($key)];
        });

        RateLimiter::for($write['name'], function (Request $request) use ($write) {
            $key = optional($request->user())->id ?: $request->ip();

            return [Limit::perMinute((int) $write['per_minute'])->by($key)];
        });
    }
}
