<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('films', function (Blueprint $table) {
            $table->string('slug')->primary();
            $table->string('camera_slug');
            $table->string('name');
            $table->string('iso');
            $table->string('description');
            $table->string('accent', 9);
            $table->string('bg', 9);
            $table->string('tag');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('camera_slug')
                ->references('slug')->on('cameras')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('films');
    }
};
