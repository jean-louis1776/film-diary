<?php

namespace Database\Seeders;

use App\Models\Camera;
use App\Models\Film;
use App\Models\Photo;
use Illuminate\Database\Seeder;

/**
 * Seeds the catalog with the content that previously lived hardcoded in
 * apps/web/src/data/films.ts. Object keys follow the existing CDN layout
 * rolls/{camera}/{film}/{frame}.jpg, so already-uploaded files keep working.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $cameras = [
            ['slug' => 'minolta-af2', 'name' => 'Minolta Hi-Matic AF2', 'short_name' => 'MINOLTA AF2', 'sort_order' => 0],
            ['slug' => 'sprocket-rocket', 'name' => 'Lomography Sprocket Rocket', 'short_name' => 'SPROCKET ROCKET', 'sort_order' => 1],
            ['slug' => 'lomomatic-110', 'name' => 'Lomography Lomomatic 110', 'short_name' => 'LOMOMATIC 110', 'sort_order' => 2],
            ['slug' => 'yashica-mat-124g', 'name' => 'Yashica Mat-124G', 'short_name' => 'YASHICA MAT-124G', 'sort_order' => 3],
        ];

        foreach ($cameras as $camera) {
            Camera::updateOrCreate(['slug' => $camera['slug']], $camera);
        }

        $films = [
            [
                'slug' => 'ilford-hp5-plus',
                'camera_slug' => 'minolta-af2',
                'name' => 'Ilford HP5 Plus',
                'iso' => 'ISO 400',
                'description' => 'Fine grain, smooth midtones, wide latitude — the pushable classic',
                'accent' => '#C2C5CE',
                'bg' => '#080A0D',
                'tag' => 'B&W · CLASSIC · ISO 400',
                'sort_order' => 0,
                'frame_count' => 7,
            ],
            [
                'slug' => 'ilford-kentmere-400',
                'camera_slug' => 'minolta-af2',
                'name' => 'Ilford Kentmere Pan',
                'iso' => 'ISO 400',
                'description' => 'Stronger contrast, visible grain, raw gritty street character',
                'accent' => '#AFA290',
                'bg' => '#100D09',
                'tag' => 'B&W · GRITTY · ISO 400',
                'sort_order' => 1,
                'frame_count' => 5,
            ],
            [
                'slug' => 'kodak-ultramax-400',
                'camera_slug' => 'minolta-af2',
                'name' => 'Kodak Ultramax',
                'iso' => 'ISO 400',
                'description' => 'Vivid, punchy colors — bold blues, lush greens, warm skin tones',
                'accent' => '#E8A23A',
                'bg' => '#15100A',
                'tag' => 'COLOR · DAYLIGHT · ISO 400',
                'sort_order' => 2,
                'frame_count' => 4,
            ],
            [
                'slug' => 'lomography-cn400',
                'camera_slug' => 'minolta-af2',
                'name' => 'Lomography Color Neg',
                'iso' => 'ISO 400',
                'description' => 'Vintage muted palette, slight brownish warmth, noisy grain',
                'accent' => '#C4607A',
                'bg' => '#120810',
                'tag' => 'COLOR · VINTAGE · ISO 400',
                'sort_order' => 3,
                'frame_count' => 8,
            ],
            [
                'slug' => 'orwo-wolfen-nc400',
                'camera_slug' => 'minolta-af2',
                'name' => 'ORWO Wolfen NC400',
                'iso' => 'ISO 400',
                'description' => 'Vibrant greens, desaturated shadows, cool cast — unlike anything else',
                'accent' => '#6BAF7C',
                'bg' => '#080F0A',
                'tag' => 'COLOR · COOL TONES · ISO 400',
                'sort_order' => 4,
                'frame_count' => 6,
            ],
        ];

        foreach ($films as $filmData) {
            $frameCount = $filmData['frame_count'];
            unset($filmData['frame_count']);

            $film = Film::updateOrCreate(['slug' => $filmData['slug']], $filmData);

            for ($frame = 1; $frame <= $frameCount; $frame++) {
                Photo::updateOrCreate(
                    [
                        'film_slug' => $film->slug,
                        'frame' => $frame,
                    ],
                    [
                        'object_key' => Photo::buildObjectKey($film->camera_slug, $film->slug, $frame),
                        'width' => 800,
                        'height' => 600,
                        'is_published' => true,
                    ],
                );
            }
        }
    }
}
