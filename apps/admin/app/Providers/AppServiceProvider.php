<?php

namespace App\Providers;

use App\Models\Camera;
use App\Models\Film;
use App\Models\Photo;
use App\Support\CatalogPublisher;
use Illuminate\Support\Facades\URL;
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
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Any catalog change re-publishes rolls/catalog.json + manifest.json
        // to the bucket (once per request, after the response is sent)
        foreach ([Camera::class, Film::class, Photo::class] as $model) {
            $model::saved(fn () => CatalogPublisher::publishDeferred());
            $model::deleted(fn () => CatalogPublisher::publishDeferred());
        }
    }
}
