<?php

namespace App\Filament\Resources\Films\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FilmsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('camera.name')
                    ->sortable(),
                TextColumn::make('iso'),
                ColorColumn::make('accent'),
                ColorColumn::make('bg'),
                TextColumn::make('photos_count')
                    ->label('Photos')
                    ->counts('photos'),
                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
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
