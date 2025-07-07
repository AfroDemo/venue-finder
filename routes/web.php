<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenueController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin/venues', [VenueController::class, 'index'])->name('admin.venues');
    Route::get('/admin/venues/create', [VenueController::class, 'create'])->name('admin.venues.create');
    Route::get('/admin/venues/edit/{venue}', [VenueController::class, 'edit'])->name('admin.venues.edit');
    Route::post('/admin/venues', [VenueController::class, 'store'])->name('admin.venues.store');
    Route::put('/admin/venues/{venue}', [VenueController::class, 'update'])->name('admin.venues.update');
    Route::delete('/admin/venues/{venue}', [VenueController::class, 'destroy'])->name('admin.venues.destroy');
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::get('/admin/users/edit/{user}', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
// });

Route::get('/', [HomeController::class, 'index'])->name('home');
