<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    protected $fillable = [
        'film_slug',
        'object_key',
        'frame',
        'width',
        'height',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class, 'film_slug');
    }

    /** Public URL served via CDN (prod) or MinIO (dev). */
    public function url(): string
    {
        return rtrim(config('services.cdn.url'), '/').'/'.ltrim($this->object_key, '/');
    }

    /** Expected object key for this photo's film/frame. */
    public static function buildObjectKey(string $cameraSlug, string $filmSlug, int $frame, string $extension = 'jpg'): string
    {
        return "rolls/{$cameraSlug}/{$filmSlug}/{$frame}.{$extension}";
    }

    /** Move the underlying S3 object when the key changes; delete with the row. */
    protected static function booted(): void
    {
        static::deleted(function (Photo $photo) {
            $disk = Storage::disk('s3');

            if ($disk->exists($photo->object_key)) {
                $disk->delete($photo->object_key);
            }
        });
    }
}
