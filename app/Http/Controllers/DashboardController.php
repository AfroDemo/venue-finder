<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $venues = Venue::all();
        $user=Auth::user();

        if($user->role=='admin'){
            return Inertia::render('admin/dashboard', [
            'venues' => $venues,
            'flash' => session('flash', []),
        ]);
        }else{
            return redirect()->route('home');
        }
    }
}
