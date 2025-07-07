<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $venues = Auth::check() ? Venue::all() : [];
        return Inertia::render('welcome', [
            'venues' => $venues,
            'flash' => session('flash', []),
        ]);
    }
}
