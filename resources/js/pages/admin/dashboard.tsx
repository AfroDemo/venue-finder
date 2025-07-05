'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import AppLayout from '@/layouts/app-layout';
import { Venue } from '@/types/venue';
import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
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
            const latitude = Number.parseFloat(newVenue.latitude as string);
            const longitude = Number.parseFloat(newVenue.longitude as string);
            if (isNaN(latitude) || isNaN(longitude)) {
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
            const latitude = Number.parseFloat(editingVenue.latitude as number | string);
            const longitude = Number.parseFloat(editingVenue.longitude as number | string);
            if (isNaN(latitude) || isNaN(longitude)) {
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
                            <div>
                                <Label htmlFor="venue-name">Venue Name *</Label>
                                <Input
                                    id="venue-name"
                                    required
                                    value={editingVenue ? editingVenue.name : newVenue.name}
                                    onChange={(e) =>
                                        editingVenue
                                            ? setEditingVenue({ ...editingVenue, name: e.target.value })
                                            : setNewVenue({ ...newVenue, name: e.target.value })
                                    }
                                    placeholder="Enter venue name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="block-name">Block Name</Label>
                                <Input
                                    id="block-name"
                                    value={editingVenue ? editingVenue.block_name || '' : newVenue.block_name || ''}
                                    onChange={(e) =>
                                        editingVenue
                                            ? setEditingVenue({ ...editingVenue, block_name: e.target.value })
                                            : setNewVenue({ ...newVenue, block_name: e.target.value })
                                    }
                                    placeholder="Enter block name (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    required
                                    value={editingVenue ? editingVenue.description : newVenue.description}
                                    onChange={(e) =>
                                        editingVenue
                                            ? setEditingVenue({ ...editingVenue, description: e.target.value })
                                            : setNewVenue({ ...newVenue, description: e.target.value })
                                    }
                                    placeholder="Enter venue description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="latitude">Latitude *</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={editingVenue ? (editingVenue.latitude ?? '') : (newVenue.latitude ?? '')}
                                        onChange={(e) =>
                                            editingVenue
                                                ? setEditingVenue({ ...editingVenue, latitude: e.target.value })
                                                : setNewVenue({ ...newVenue, latitude: e.target.value })
                                        }
                                        placeholder="-8.9094"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="longitude">Longitude *</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={editingVenue ? (editingVenue.longitude ?? '') : (newVenue.longitude ?? '')}
                                        onChange={(e) =>
                                            editingVenue
                                                ? setEditingVenue({ ...editingVenue, longitude: e.target.value })
                                                : setNewVenue({ ...newVenue, longitude: e.target.value })
                                        }
                                        placeholder="33.4608"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {editingVenue ? 'Update Venue' : 'Add Venue'}
                                </Button>
                                {editingVenue && (
                                    <Button type="button" variant="outline" onClick={() => setEditingVenue(null)} className="w-full">
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Venue List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Venues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {venues.length === 0 ? (
                            <p className="text-gray-600">No venues available.</p>
                        ) : (
                            <div className="space-y-2">
                                {venues.map((venue) => (
                                    <div key={venue.id} className="flex items-center justify-between rounded-xl border p-2">
                                        <div>
                                            <p className="font-medium">{venue.name}</p>
                                            <p className="text-sm text-gray-600">{venue.block_name || 'No block'}</p>
                                            <p className="text-sm">{venue.description}</p>
                                            <p className="text-sm text-gray-600">
                                                {venue.latitude}, {venue.longitude}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditingVenue(venue)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteVenue(venue.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
