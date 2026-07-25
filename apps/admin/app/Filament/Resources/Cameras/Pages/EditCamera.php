<?php

namespace App\Filament\Resources\Cameras\Pages;

use App\Filament\Resources\Cameras\CameraResource;
use App\Models\Camera;
use App\Support\PhotoStorage;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditCamera extends EditRecord
{
    protected static string $resource = CameraResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    /**
     * The slug is the camera's folder in the bucket. Changing it moves every
     * photo of every roll to the new prefix; films.camera_slug follows through
     * the ON UPDATE CASCADE foreign key.
     */
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        /** @var Camera $record */
        $oldSlug = $record->slug;
        $newSlug = $data['slug'] ?? $oldSlug;

        $record->update($data);

        if ($newSlug !== $oldSlug) {
            $moved = PhotoStorage::reKeyCamera($record->refresh());

            Notification::make()
                ->title("Moved {$moved} file(s) to rolls/{$newSlug}/")
                ->body('The CDN may keep serving the old URLs until its cache expires.')
                ->success()
                ->send();
        }

        return $record;
    }
}
