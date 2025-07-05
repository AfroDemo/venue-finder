<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $venues = Venue::all();
        return Inertia::render('welcome', [
            'venues' => $venues
        ]);
    }
}
