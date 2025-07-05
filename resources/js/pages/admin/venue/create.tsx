'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Venues', href: '/admin/venues' },
    { title: 'Create', href: '/admin/venues/create' },
];

export default function CreateVenue() {
    const [newVenue, setNewVenue] = useState({
        name: '',
        block_name: '',
        description: '',
        latitude: '',
        longitude: '',
    });

    const handleCreateVenue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const latitude = Number.parseFloat(newVenue.latitude);
            const longitude = Number.parseFloat(newVenue.longitude);
            if (isNaN(latitude) || isNaN(longitude)) {
                alert('Invalid latitude or longitude');
                return;
            }
            await router.post(
                '/admin/venues',
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
                            latitude: '',
                            longitude: '',
                        });
                        alert('Venue created successfully!');
                    },
                    onError: () => alert('Error creating venue'),
                },
            );
        } catch (error) {
            console.error('Error creating venue:', error);
            alert('Error creating venue');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Venue" />
            <div className="container mx-auto max-w-md p-4">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Venue</h1>
                    <Link href="/admin/venues">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Venues
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Add Venue</CardTitle>
                        <CardDescription>Add a new venue to the MUST system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateVenue} className="space-y-4">
                            <div>
                                <Label htmlFor="create-name">Venue Name *</Label>
                                <Input
                                    id="create-name"
                                    required
                                    value={newVenue.name}
                                    onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                                    placeholder="Enter venue name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="create-block">Block Name</Label>
                                <Input
                                    id="create-block"
                                    value={newVenue.block_name}
                                    onChange={(e) => setNewVenue({ ...newVenue, block_name: e.target.value })}
                                    placeholder="Enter block name (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="create-description">Description *</Label>
                                <Textarea
                                    id="create-description"
                                    required
                                    value={newVenue.description}
                                    onChange={(e) => setNewVenue({ ...newVenue, description: e.target.value })}
                                    placeholder="Enter venue description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="create-latitude">Latitude *</Label>
                                    <Input
                                        id="create-latitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={newVenue.latitude}
                                        onChange={(e) => setNewVenue({ ...newVenue, latitude: e.target.value })}
                                        placeholder="-8.9094"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="create-longitude">Longitude *</Label>
                                    <Input
                                        id="create-longitude"
                                        type="number"
                                        step="any"
                                        required
                                        value={newVenue.longitude}
                                        onChange={(e) => setNewVenue({ ...newVenue, longitude: e.target.value })}
                                        placeholder="33.4608"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                    Create Venue
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
