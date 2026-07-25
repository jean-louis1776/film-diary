<?php

namespace App\Filament\Resources\Cameras\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CameraForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->label('Slug (folder on CDN)')
                    ->helperText('e.g. minolta-af2 — becomes part of the object key, cannot change later')
                    ->required()
                    ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                    ->unique(ignoreRecord: true)
                    ->disabledOn('edit'),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('short_name')
                    ->label('Short name (UI badge)')
                    ->required()
                    ->maxLength(255),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
