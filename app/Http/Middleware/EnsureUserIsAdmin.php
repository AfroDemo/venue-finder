<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('home')->with('flash', ['error' => 'Unauthorized access']);
        }
        return $next($request);
    }
}
