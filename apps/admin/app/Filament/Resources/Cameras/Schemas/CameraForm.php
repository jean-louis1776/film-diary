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
                    ->label('Slug (folder in the bucket)')
                    ->helperText('e.g. minolta-af2. Changing this moves every photo of this camera to the new folder; old CDN links stop working.')
                    ->required()
                    ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                    ->unique(ignoreRecord: true),
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
