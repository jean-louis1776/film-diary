<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

/**
 * Creates (or resets the password of) an admin user for the Filament panel.
 * Interactive by default — no default credentials ever live in code or
 * seeders. `--from-env` exists for platforms without an interactive shell
 * (e.g. Render free tier): it bootstraps the first admin from
 * ADMIN_EMAIL/ADMIN_PASSWORD env vars and never overwrites an existing user.
 */
class MakeAdminUser extends Command
{
    protected $signature = 'app:make-admin
        {--email= : Email (asked interactively when omitted)}
        {--from-env : Create from ADMIN_EMAIL/ADMIN_PASSWORD env vars, skip if the user exists}';

    protected $description = 'Create a Filament admin user or reset an existing password';

    public function handle(): int
    {
        if ($this->option('from-env')) {
            return $this->createFromEnv();
        }

        $email = $this->option('email') ?: text(
            label: 'Admin email',
            required: true,
        );

        if (! $this->validEmail($email)) {
            $this->error('Invalid email address.');

            return self::FAILURE;
        }

        $passwordValue = password(
            label: 'Password (min 12 chars)',
            required: true,
            validate: fn (string $value) => strlen($value) < 12
                ? 'Use at least 12 characters.'
                : null,
        );

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => strstr($email, '@', true) ?: 'admin',
                'password' => Hash::make($passwordValue),
            ],
        );

        $this->info($user->wasRecentlyCreated
            ? "Admin {$email} created."
            : "Password for {$email} updated.");

        return self::SUCCESS;
    }

    private function createFromEnv(): int
    {
        $email = env('ADMIN_EMAIL');
        $passwordValue = env('ADMIN_PASSWORD');

        if (! $email || ! $passwordValue) {
            $this->error('ADMIN_EMAIL and ADMIN_PASSWORD env vars are required for --from-env.');

            return self::FAILURE;
        }

        if (! $this->validEmail($email)) {
            $this->error('ADMIN_EMAIL is not a valid email address.');

            return self::FAILURE;
        }

        if (strlen($passwordValue) < 12) {
            $this->error('ADMIN_PASSWORD must be at least 12 characters.');

            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->info("Admin {$email} already exists — nothing to do.");

            return self::SUCCESS;
        }

        User::create([
            'name' => strstr($email, '@', true) ?: 'admin',
            'email' => $email,
            'password' => Hash::make($passwordValue),
        ]);

        $this->info("Admin {$email} created from env.");

        return self::SUCCESS;
    }

    private function validEmail(string $email): bool
    {
        return ! Validator::make(['email' => $email], ['email' => ['required', 'email']])->fails();
    }
}
