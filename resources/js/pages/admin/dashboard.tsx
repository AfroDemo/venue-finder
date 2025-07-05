'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Venue } from '@/types/venue';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardProps {
    venues: Venue[];
}

export default function Dashboard({ venues }: DashboardProps) {
    // Defensive: ensure venues is always an array
    const safeVenues = Array.isArray(venues) ? venues : [];
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [newVenue, setNewVenue] = useState<Partial<Venue>>({
        name: '',
        block_name: '',
        description: '',
        latitude: undefined,
        longitude: undefined,
    });

    const handleAddVenue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const latitude = typeof newVenue.latitude === 'string' ? Number.parseFloat(newVenue.latitude) : newVenue.latitude;
            const longitude = typeof newVenue.longitude === 'string' ? Number.parseFloat(newVenue.longitude) : newVenue.longitude;
            if (typeof latitude !== 'number' || isNaN(latitude) || typeof longitude !== 'number' || isNaN(longitude)) {
                alert('Invalid latitude or longitude');
                return;
            }
            await router.post(
                '/venues',
                {
                    name: newVenue.name,
                    block_name: newVenue.block_name || null,
                    description: newVenue.description,
                    latitude,
                    longitude,
                },
                {
                    onSuccess: () => {
                        setNewVenue({
                            name: '',
                            block_name: '',
                            description: '',
                            latitude: undefined,
                            longitude: undefined,
                        });
                        alert('Venue added successfully!');
                    },
                    onError: () => alert('Error adding venue'),
                },
            );
        } catch (error) {
            console.error('Error adding venue:', error);
            alert('Error adding venue');
        }
    };

    const handleUpdateVenue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVenue) return;
        try {
            const latitude = typeof editingVenue.latitude === 'string' ? Number.parseFloat(editingVenue.latitude) : editingVenue.latitude;
            const longitude = typeof editingVenue.longitude === 'string' ? Number.parseFloat(editingVenue.longitude) : editingVenue.longitude;
            if (typeof latitude !== 'number' || isNaN(latitude) || typeof longitude !== 'number' || isNaN(longitude)) {
                alert('Invalid latitude or longitude');
                return;
            }
            await router.put(
                `/venues/${editingVenue.id}`,
                {
                    name: editingVenue.name,
                    block_name: editingVenue.block_name || null,
                    description: editingVenue.description,
                    latitude,
                    longitude,
                },
                {
                    onSuccess: () => {
                        setEditingVenue(null);
                        alert('Venue updated successfully!');
                    },
                    onError: () => alert('Error updating venue'),
                },
            );
        } catch (error) {
            console.error('Error updating venue:', error);
            alert('Error updating venue');
        }
    };

    const handleDeleteVenue = async (id: number) => {
        if (confirm('Are you sure you want to delete this venue?')) {
            try {
                await router.delete(`/venues/${id}`, {
                    onSuccess: () => alert('Venue deleted successfully!'),
                    onError: () => alert('Error deleting venue'),
                });
            } catch (error) {
                console.error('Error deleting venue:', error);
                alert('Error deleting venue');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">Venue Management</h1>
                {/* Add/Edit Venue Form */}
                <Card className="mb-6 max-w-lg">
                    <CardHeader>
                        <CardTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={editingVenue ? handleUpdateVenue : handleAddVenue} className="space-y-4">
                            {/* ...existing code... */}
                        </form>
                    </CardContent>
                </Card>
                {/* Venue List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Venues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {safeVenues.length === 0 ? (
                            <p className="text-gray-600">No venues available.</p>
                        ) : (
                            <div className="space-y-2">
                                {safeVenues.map((venue) => (
                                    <div key={venue.id} className="flex items-center justify-between rounded-xl border p-2">
                                        {/* ...existing code... */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
