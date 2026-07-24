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
 * Interactive on purpose: no default credentials ever live in code or seeders.
 */
class MakeAdminUser extends Command
{
    protected $signature = 'app:make-admin
        {--email= : Email (asked interactively when omitted)}';

    protected $description = 'Create a Filament admin user or reset an existing password';

    public function handle(): int
    {
        $email = $this->option('email') ?: text(
            label: 'Admin email',
            required: true,
        );

        $validator = Validator::make(['email' => $email], ['email' => ['required', 'email']]);

        if ($validator->fails()) {
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
}
