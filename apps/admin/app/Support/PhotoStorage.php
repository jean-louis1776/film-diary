<?php

namespace App\Support;

use App\Models\Film;
use App\Models\Photo;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

/** S3 object plumbing shared by the Photo create/edit pages. */
class PhotoStorage
{
    public static function disk(): Filesystem
    {
        return Storage::disk('s3');
    }

    /** @return array{0:int,1:int} [width, height] */
    public static function dimensions(string $objectKey): array
    {
        $bytes = self::disk()->get($objectKey);
        $info = $bytes === null ? false : @getimagesizefromstring($bytes);

        return $info ? [(int) $info[0], (int) $info[1]] : [0, 0];
    }

    public static function nextFrame(string $filmSlug): int
    {
        return (int) Photo::where('film_slug', $filmSlug)->max('frame') + 1;
    }

    /** Move a temporary upload to its final deterministic key and create the row. */
    public static function placeUpload(Film $film, string $tmpKey, int $frame, bool $published = true): Photo
    {
        $extension = strtolower(pathinfo($tmpKey, PATHINFO_EXTENSION) ?: 'jpg');
        $finalKey = Photo::buildObjectKey($film->camera_slug, $film->slug, $frame, $extension);

        $disk = self::disk();

        if ($disk->exists($finalKey)) {
            $disk->delete($finalKey);
        }

        $disk->move($tmpKey, $finalKey);

        [$width, $height] = self::dimensions($finalKey);

        return Photo::create([
            'film_slug' => $film->slug,
            'object_key' => $finalKey,
            'frame' => $frame,
            'width' => $width,
            'height' => $height,
            'is_published' => $published,
        ]);
    }

    /** Rename the S3 object when a photo's frame number changes. */
    public static function renameToFrame(Photo $photo, int $newFrame): string
    {
        $extension = strtolower(pathinfo($photo->object_key, PATHINFO_EXTENSION) ?: 'jpg');
        $newKey = Photo::buildObjectKey($photo->film->camera_slug, $photo->film_slug, $newFrame, $extension);

        if ($newKey === $photo->object_key) {
            return $newKey;
        }

        $disk = self::disk();

        if ($disk->exists($photo->object_key)) {
            if ($disk->exists($newKey)) {
                $disk->delete($newKey);
            }
            $disk->move($photo->object_key, $newKey);
        }

        return $newKey;
    }
}
