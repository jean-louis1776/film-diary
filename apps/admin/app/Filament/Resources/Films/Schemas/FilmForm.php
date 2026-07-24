<?php

namespace App\Filament\Resources\Films\Schemas;

use App\Models\Camera;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FilmForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->label('Slug (folder on CDN)')
                    ->helperText('e.g. ilford-hp5-plus — becomes part of the object key, cannot change later')
                    ->required()
                    ->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                    ->unique(ignoreRecord: true)
                    ->disabledOn('edit'),
                Select::make('camera_slug')
                    ->label('Camera')
                    ->options(fn () => Camera::query()->orderBy('sort_order')->pluck('name', 'slug'))
                    ->required()
                    ->disabledOn('edit'),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('iso')
                    ->required()
                    ->placeholder('ISO 400'),
                TextInput::make('description')
                    ->required()
                    ->maxLength(255),
                ColorPicker::make('accent')
                    ->required(),
                ColorPicker::make('bg')
                    ->label('Background')
                    ->required(),
                TextInput::make('tag')
                    ->required()
                    ->placeholder('B&W · CLASSIC · ISO 400'),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
