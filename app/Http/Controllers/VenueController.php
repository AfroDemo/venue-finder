<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VenueController extends Controller
{
    public function index()
    {
        try {
            $venues = Venue::all();
            return Inertia::render('Dashboard', [
                'venues' => $venues,
                'flash' => session('flash', []),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching venues: ' . $e->getMessage());
            return Inertia::render('Dashboard', [
                'venues' => [],
                'flash' => ['error' => 'Failed to load venues. Please try again.'],
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('admin/venues/create', [
            'flash' => session('flash', []),
        ]);
    }

    public function edit(Venue $venue)
    {
        return Inertia::render('admin/venues/edit', [
            'venue' => $venue,
            'flash' => session('flash', []),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'block_name' => 'nullable|string|max:255',
                'description' => 'required|string',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
            ]);

            DB::beginTransaction();
            $venue = Venue::create($validated);
            DB::commit();

            return redirect()->route('admin.venues')->with('flash', ['success' => 'Venue created successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating venue: ' . $e->getMessage());
            return redirect()->route('admin.venues')->with('flash', ['error' => 'Failed to create venue: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Venue $venue)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'block_name' => 'nullable|string|max:255',
                'description' => 'required|string',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
            ]);

            DB::beginTransaction();
            $venue->update($validated);
            DB::commit();

            return redirect()->route('admin.venues')->with('flash', ['success' => 'Venue updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating venue: ' . $e->getMessage());
            return redirect()->route('admin.venues')->with('flash', ['error' => 'Failed to update venue: ' . $e->getMessage()]);
        }
    }

    public function destroy(Venue $venue)
    {
        try {
            DB::beginTransaction();
            $venue->delete();
            DB::commit();

            return redirect()->route('admin.venues')->with('flash', ['success' => 'Venue deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting venue: ' . $e->getMessage());
            return redirect()->route('admin.venues')->with('flash', ['error' => 'Failed to delete venue: ' . $e->getMessage()]);
        }
    }
}
