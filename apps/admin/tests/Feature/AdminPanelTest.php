<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_is_reachable(): void
    {
        $this->get('/login')->assertOk();
    }

    public function test_guests_are_sent_to_the_login_page(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    /**
     * Filament denies panel access outside the local environment unless the
     * User model implements FilamentUser — regression guard for that 403.
     */
    public function test_authenticated_user_can_access_the_panel_in_production(): void
    {
        config(['app.env' => 'production']);

        $user = User::factory()->create();

        $this->actingAs($user)->get('/')->assertOk();
    }
}
