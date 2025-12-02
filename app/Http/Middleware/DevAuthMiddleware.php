<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DevAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * TEMPORARY: This middleware bypasses authentication for development
     * TODO: Remove this middleware once CORS/cookie issues are resolved
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the first user, or create a dev user if none exists
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Dev User',
                'email' => 'dev@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Authenticate as this user
        Auth::login($user);

        return $next($request);
    }
}
