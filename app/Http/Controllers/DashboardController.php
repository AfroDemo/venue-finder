<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $venues = Venue::all();
        return Inertia::render('admin/dashboard', [
            'venues' => $venues,
            'flash' => session('flash', []),
        ]);
    }
}
