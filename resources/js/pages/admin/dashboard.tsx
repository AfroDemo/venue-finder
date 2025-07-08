'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Venue } from '@/types/venue';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardProps {
    venues: Venue[];
    auth: { user: any };
    flash: { success?: string; error?: string };
}

export default function Dashboard({ venues, auth, flash }: DashboardProps) {
    // Defensive: ensure venues is always an array
    const safeVenues = Array.isArray(venues) ? venues : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto max-w-7xl p-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Overview of MUST venue management</p>
                    </div>
                    <Link href="/admin/venues">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <MapPin className="mr-2 h-4 w-4" />
                            Manage Venues
                        </Button>
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash.success && <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                {flash.error && <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

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
                            <CardTitle className="text-sm font-medium">Without Blocks</CardTitle>
                            <Badge variant="outline" className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeVenues.filter((v) => !v.block_name).length}</div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Recent Venues */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Venues</CardTitle>
                        <Link href="/admin/venues/create">
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Venue
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {safeVenues.length === 0 ? (
                            <p className="text-gray-600">No venues available.</p>
                        ) : (
                            <div className="space-y-4">
                                {safeVenues.slice(0, 5).map((venue) => (
                                    <div key={venue.id} className="flex items-center justify-between rounded-xl border p-3">
                                        <div>
                                            <h3 className="font-medium">{venue.name}</h3>
                                            <p className="max-w-md truncate text-sm text-gray-600">{venue.description}</p>
                                            {venue.block_name && (
                                                <Badge variant="secondary" className="mt-1">
                                                    {venue.block_name}
                                                </Badge>
                                            )}
                                        </div>
                                        <Link href={`/admin/venues/edit/${venue.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                                {safeVenues.length > 5 && (
                                    <div className="mt-4 text-center">
                                        <Link href="/admin/venues">
                                            <Button variant="link">View All Venues</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
