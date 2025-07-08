'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Venue } from '@/types/venue';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Venues', href: '/admin/venues' },
];

interface AdminVenuesProps {
    venues: Venue[];
    auth: { user: any };
    flash: { success?: string; error?: string };
}

export default function AdminVenues({ venues, auth, flash }: AdminVenuesProps) {
    const [safeVenues, setSafeVenues] = useState<Venue[]>(Array.isArray(venues) ? venues : []);

    const handleDeleteVenue = async (id: number) => {
        if (!confirm('Are you sure you want to delete this venue?')) return;

        try {
            await router.delete(`/admin/venues/${id}`, {
                onSuccess: () => {
                    alert('Venue deleted successfully!');
                    setSafeVenues(safeVenues.filter((venue) => venue.id !== id));
                },
                onError: () => alert('Error deleting venue'),
            });
        } catch (error) {
            console.error('Error deleting venue:', error);
            alert('Error deleting venue');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Venue Management" />
            <div className="container mx-auto max-w-7xl p-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
                        <p className="text-gray-600">Manage MUST venues</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                {/* <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeVenues.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">With Blocks</CardTitle>
                            <Badge variant="secondary" className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeVenues.filter((v) => v.block_name).length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="/font-medium text-sm">Without Blocks</CardTitle>
                            <Badge variant="outline" className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeVenues.filter((v) => !v.block_name).length}</div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Actions */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">All Venues</h2>
                    <Link href="/admin/venues/create">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Venue
                        </Button>
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash.success && <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash.error && <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                {/* Venues Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Block</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Coordinates</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {safeVenues.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-600">
                                            No venues available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    safeVenues.map((venue) => (
                                        <TableRow key={venue.id}>
                                            <TableCell className="font-medium">{venue.name}</TableCell>
                                            <TableCell>
                                                {venue.block_name ? (
                                                    <Badge variant="secondary">{venue.block_name}</Badge>
                                                ) : (
                                                    <span className="text-gray-400">No block</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{venue.description}</TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {venue.latitude.toFixed(4)}, {venue.longitude.toFixed(4)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`,
                                                                '_blank',
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/admin/venues/edit/${venue.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteVenue(venue.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
