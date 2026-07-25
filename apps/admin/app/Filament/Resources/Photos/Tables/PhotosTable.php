<?php

namespace App\Filament\Resources\Photos\Tables;

use App\Models\Film;
use App\Models\Photo;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PhotosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('object_key')
            ->columns([
                ImageColumn::make('preview')
                    ->state(fn (Photo $record): string => $record->url())
                    ->imageHeight(56),
                TextColumn::make('film.name')
                    ->sortable(),
                TextColumn::make('object_key')
                    ->label('Object key')
                    ->searchable()
                    ->copyable(),
                TextColumn::make('frame')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('width')
                    ->numeric()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('height')
                    ->numeric()
                    ->toggleable(isToggledHiddenByDefault: true),
                ToggleColumn::make('is_published'),
            ])
            ->filters([
                SelectFilter::make('film_slug')
                    ->label('Film roll')
                    ->options(fn () => Film::query()->orderBy('sort_order')->pluck('name', 'slug')),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
