<?php

namespace App\Console\Commands;

use App\Support\CatalogPublisher;
use Illuminate\Console\Command;

class PublishManifest extends Command
{
    protected $signature = 'manifest:publish';

    protected $description = 'Publish rolls/catalog.json and rolls/manifest.json to the bucket';

    public function handle(): int
    {
        CatalogPublisher::publish();

        $this->info('Published rolls/catalog.json and rolls/manifest.json.');

        return self::SUCCESS;
    }
}
