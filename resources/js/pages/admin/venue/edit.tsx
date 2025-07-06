'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Venue } from '@/types/venue';
import { Textarea } from '@/components/ui/Textarea';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface EditVenueProps {
    venue: Venue;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Venues', href: '/admin/venues' },
    { title: 'Edit', href: '' },
];

export default function EditVenue({ venue }: EditVenueProps) {
    const [editingVenue, setEditingVenue] = useState<Venue>({ ...venue });

    useEffect(() => {
        setEditingVenue({ ...venue });
    }, [venue]);

    const handleUpdateVenue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const latitude = Number.parseFloat(String(editingVenue.latitude));
            const longitude = Number.parseFloat(String(editingVenue.longitude));
            if (isNaN(latitude) || isNaN(longitude)) {
                alert('Invalid latitude or longitude');
                return;
            }
            await router.put(
                `/admin/venues/${editingVenue.id}`,
                {
                    name: editingVenue.name,
                    block_name: editingVenue.block_name || null,
                    description: editingVenue.description,
                    latitude,
                    longitude,
                },
                {
                    onSuccess: () => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Venue" />
            <div className="container mx-auto p-4 max-w-md">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Venue</h1>
                    <Link href="/admin/venues">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Venues
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Update Venue</CardTitle>
                        <CardDescription>Update venue information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateVenue} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Venue Name *</Label>
                                <Input
                                    id="edit-name"
                                    required
                                    value={editingVenue.name}
                                    onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                                    placeholder="Enter venue name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-block">Block Name</Label>
                                <Input
                                    id="edit-block"
                                    value={editingVenue.block_name || ''}
                                    onChange={(e) => setEditingVenue({ ...editingVenue, block_name: e.target.value })}
                                    placeholder="Enter block name (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description *</Label>
                                <Textarea
                                    id="edit-description"
                                    required
                                    value={editingVenue.description}
                                    onChange={(e) => setEditingVenue({ ...editingVenue, description: e.target.value })}
                                    placeholder="Enter venue description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-latitude">Latitude *</Label>
                                    <Input
                                        id="edit-latitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={editingVenue.latitude}
                                        onChange={(e) =>
                                            setEditingVenue({ ...editingVenue, latitude: Number.parseFloat(e.target.value) })
                                        }
                                        placeholder="-8.9094"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-longitude">Longitude *</Label>
                                    <Input
                                        id="edit-longitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={editingVenue.longitude}
                                        onChange={(e) =>
                                            setEditingVenue({ ...editingVenue, longitude: Number.parseFloat(e.target.value) })
                                        }
                                        placeholder="33.4608"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    Update Venue
                                </Button>
                                <Link href="/admin/venues">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
