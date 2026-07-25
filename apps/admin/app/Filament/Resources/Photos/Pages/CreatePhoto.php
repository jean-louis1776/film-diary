<?php

namespace App\Filament\Resources\Photos\Pages;

use App\Filament\Resources\Photos\PhotoResource;
use App\Models\Film;
use App\Support\PhotoStorage;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreatePhoto extends CreateRecord
{
    protected static string $resource = PhotoResource::class;

    /**
     * One form submit may carry several files; each becomes a Photo with the
     * next sequential frame number and a deterministic object key.
     */
    protected function handleRecordCreation(array $data): Model
    {
        $film = Film::findOrFail($data['film_slug']);
        $uploads = (array) ($data['uploads'] ?? []);

        $frame = PhotoStorage::nextFrame($film->slug);
        $photo = null;

        foreach ($uploads as $tmpKey) {
            $photo = PhotoStorage::placeUpload($film, $tmpKey, $frame++);
        }

        abort_unless($photo !== null, 422, 'No files were uploaded.');

        return $photo;
    }
}
