<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Film extends Model
{
    protected $primaryKey = 'slug';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'slug',
        'camera_slug',
        'name',
        'iso',
        'description',
        'accent',
        'bg',
        'tag',
        'sort_order',
    ];

    public function camera(): BelongsTo
    {
        return $this->belongsTo(Camera::class, 'camera_slug');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class, 'film_slug')->orderBy('frame');
    }
}
