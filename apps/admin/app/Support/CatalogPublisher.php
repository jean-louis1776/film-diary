<?php

namespace App\Support;

use App\Models\Camera;
use App\Models\Film;
use Illuminate\Support\Facades\Storage;

/**
 * Publishes the public catalog to the bucket (served through the CDN) so the
 * site keeps showing fresh content even when the API is unreachable:
 *
 *  - rolls/catalog.json  — full catalog (cameras + films + photo keys/sizes);
 *    the frontend builds image URLs from its own CDN base, so the file stays
 *    environment-independent
 *  - rolls/manifest.json — legacy {camera: {film: frameCount}} format, kept
 *    for older fallback code
 */
class CatalogPublisher
{
    public static function publish(): void
    {
        $disk = Storage::disk('s3');
        $options = ['CacheControl' => 'no-cache'];

        $cameras = Camera::query()->orderBy('sort_order')->get();
        $films = Film::query()->with('photos')->orderBy('sort_order')->get();

        $catalog = [
            'version' => 1,
            'generatedAt' => now()->toIso8601String(),
            'cameras' => $cameras->map(fn (Camera $camera) => [
                'id' => $camera->slug,
                'name' => $camera->name,
                'shortName' => $camera->short_name,
            ])->values(),
            'films' => $films->map(function (Film $film) {
                $photos = $film->photos->where('is_published', true)->values();

                return [
                    'id' => $film->slug,
                    'camera' => $film->camera_slug,
                    'name' => $film->name,
                    'iso' => $film->iso,
                    'description' => $film->description,
                    'accent' => $film->accent,
                    'bg' => $film->bg,
                    'tag' => $film->tag,
                    'frameCount' => $photos->count(),
                    'photos' => $photos->map(fn ($photo) => [
                        'frame' => $photo->frame,
                        'key' => $photo->object_key,
                        'width' => $photo->width,
                        'height' => $photo->height,
                    ]),
                ];
            })->values(),
        ];

        $manifest = [];
        foreach ($films as $film) {
            $manifest[$film->camera_slug][$film->slug] = $film->photos->where('is_published', true)->count();
        }

        $disk->put('rolls/catalog.json', json_encode($catalog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $options);
        $disk->put('rolls/manifest.json', json_encode($manifest, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $options);
    }

    /** Publish once per request, after the response is sent. */
    public static function publishDeferred(): void
    {
        static $scheduled = false;

        if ($scheduled) {
            return;
        }
        $scheduled = true;

        app()->terminating(function () {
            self::publish();
        });
    }
}
