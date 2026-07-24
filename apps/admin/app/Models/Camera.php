<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Camera extends Model
{
    protected $primaryKey = 'slug';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'slug',
        'name',
        'short_name',
        'sort_order',
    ];

    public function films(): HasMany
    {
        return $this->hasMany(Film::class, 'camera_slug')->orderBy('sort_order');
    }
}
