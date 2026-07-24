<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('film_slug');
            $table->string('object_key')->unique();
            $table->unsignedInteger('frame');
            $table->unsignedInteger('width')->default(0);
            $table->unsignedInteger('height')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->foreign('film_slug')
                ->references('slug')->on('films')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->unique(['film_slug', 'frame']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
