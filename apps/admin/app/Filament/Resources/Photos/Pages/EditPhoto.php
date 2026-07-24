<?php

namespace App\Filament\Resources\Photos\Pages;

use App\Filament\Resources\Photos\PhotoResource;
use App\Support\PhotoStorage;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditPhoto extends EditRecord
{
    protected static string $resource = PhotoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    /**
     * Changing the frame renames the object in the bucket; uploading a
     * replacement overwrites the object behind the same key.
     */
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        /** @var \App\Models\Photo $record */
        $disk = PhotoStorage::disk();

        $newFrame = (int) ($data['frame'] ?? $record->frame);

        if ($newFrame !== (int) $record->frame) {
            $data['object_key'] = PhotoStorage::renameToFrame($record, $newFrame);
            $record->object_key = $data['object_key'];
        }

        $replacement = $data['replacement'] ?? null;

        if (is_string($replacement) && $replacement !== '') {
            if ($disk->exists($record->object_key)) {
                $disk->delete($record->object_key);
            }
            $disk->move($replacement, $record->object_key);

            [$data['width'], $data['height']] = PhotoStorage::dimensions($record->object_key);
        }

        unset($data['replacement']);

        $record->update($data);

        return $record;
    }
}
