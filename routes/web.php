<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VenueController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin/venues', [VenueController::class, 'index'])->name('admin.venues');
    Route::get('/admin/venues/create', [VenueController::class, 'create'])->name('admin.venues.create');
    Route::get('/admin/venues/edit/{venue}', [VenueController::class, 'edit'])->name('admin.venues.edit');
    Route::post('/admin/venues', [VenueController::class, 'store'])->name('admin.venues.store');
    Route::put('/admin/venues/{venue}', [VenueController::class, 'update'])->name('admin.venues.update');
    Route::delete('/admin/venues/{venue}', [VenueController::class, 'destroy'])->name('admin.venues.destroy');
});
