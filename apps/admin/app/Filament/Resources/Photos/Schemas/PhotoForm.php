<?php

namespace App\Filament\Resources\Photos\Schemas;

use App\Models\Film;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PhotoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('film_slug')
                    ->label('Film roll')
                    ->options(fn () => Film::query()
                        ->orderBy('sort_order')
                        ->get()
                        ->mapWithKeys(fn (Film $film) => [$film->slug => "{$film->name} ({$film->camera_slug})"]))
                    ->required()
                    ->disabledOn('edit'),

                // Create: one or more files, frames are numbered automatically
                FileUpload::make('uploads')
                    ->label('Photos')
                    ->disk('s3')
                    ->directory('uploads/tmp')
                    ->image()
                    ->multiple()
                    ->maxSize(30720)
                    ->required()
                    ->visibleOn('create'),

                // Edit: frame number is the file name on the CDN; changing it
                // renames the object in the bucket
                TextInput::make('frame')
                    ->numeric()
                    ->minValue(1)
                    ->required()
                    ->visibleOn('edit'),
                FileUpload::make('replacement')
                    ->label('Replace file (optional)')
                    ->disk('s3')
                    ->directory('uploads/tmp')
                    ->image()
                    ->maxSize(30720)
                    ->visibleOn('edit'),
                Toggle::make('is_published')
                    ->default(true)
                    ->visibleOn('edit'),
            ]);
    }
}
