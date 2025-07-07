<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::all();
            return Inertia::render('admin/user/index', [
                'users' => $users,
                'flash' => session('flash', []),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return Inertia::render('admin/user/index', [
                'users' => [],
                'flash' => ['error' => 'Failed to load users. Please try again.'],
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('admin/user/create', [
            'flash' => session('flash', []),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('admin/user/edit', [
            'user' => $user,
            'flash' => session('flash', []),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|in:user,admin',
            ]);

            DB::beginTransaction();
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);
            DB::commit();

            return redirect()->route('admin.users')->with('flash', ['success' => 'User created successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating user: ' . $e->getMessage());
            return redirect()->route('admin.users')->with('flash', ['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8',
                'role' => 'required|in:user,admin',
            ]);

            DB::beginTransaction();
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
                'role' => $validated['role'],
            ]);
            DB::commit();

            return redirect()->route('admin.users')->with('flash', ['success' => 'User updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating user: ' . $e->getMessage());
            return redirect()->route('admin.users')->with('flash', ['error' => 'Failed to update user: ' . $e->getMessage()]);
        }
    }

    public function destroy(User $user)
    {
        try {
            if ($user->role === 'admin') {
                return redirect()->route('admin.users')->with('flash', ['error' => 'Cannot delete admin user']);
            }
            DB::beginTransaction();
            $user->delete();
            DB::commit();

            return redirect()->route('admin.users')->with('flash', ['success' => 'User deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting user: ' . $e->getMessage());
            return redirect()->route('admin.users')->with('flash', ['error' => 'Failed to delete user: ' . $e->getMessage()]);
        }
    }
}
