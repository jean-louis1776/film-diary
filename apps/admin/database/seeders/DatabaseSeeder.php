<?php

namespace Database\Seeders;

use App\Support\CatalogPublisher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * No user seeding here on purpose — admins are created interactively
     * via `php artisan app:make-admin` so no credentials live in code.
     */
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        // WithoutModelEvents suppresses the auto-publish listeners, so push
        // the catalog to the bucket explicitly (skip if storage is not
        // configured yet, e.g. on a fresh install)
        try {
            CatalogPublisher::publish();
        } catch (\Throwable $e) {
            Log::warning('Catalog publish after seeding failed: '.$e->getMessage());
        }
    }
}
