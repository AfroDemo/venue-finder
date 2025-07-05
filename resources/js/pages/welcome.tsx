'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import VenueMap from '@/components/VenueMap';
import Layout from '@/layouts/layout';
import { UserLocation, Venue } from '@/types/venue';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Home', href: '/' }];

interface HomePageProps {
    venues: Venue[];
    auth: { user: any } | null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1000); // Distance in meters
}

function VenueCard({ venue, userLocation }: { venue: Venue; userLocation: UserLocation | null }) {
    const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, venue.latitude, venue.longitude) : null;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {venue.name}
                </CardTitle>
                {venue.block_name && <CardDescription className="font-medium text-gray-600">Block: {venue.block_name}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">{venue.description}</p>
                {distance !== null && (
                    <p className="text-sm font-medium text-green-600">
                        Distance: {distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`}
                    </p>
                )}
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        Navigate with Google Maps
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function HomePage({ venues, auth }: HomePageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                },
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const filteredVenues = venues.filter((venue) => venue.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="MUST Venue Finder" />
            <div className="p-4">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">MUST Venue Finder</h1>
                    <p className="text-lg text-gray-600">Find venues on Mbeya University campus</p>
                </div>
                {auth?.user && (
                    <div className="mb-8">
                        <Link href="/dashboard" className="text-accent underline">
                            Admin Dashboard
                        </Link>
                    </div>
                )}
                <div className="mb-6">
                    <div className="relative mx-auto max-w-md">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search venues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-3 pl-10 text-lg"
                        />
                    </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-4 text-2xl font-semibold">Venues ({filteredVenues.length})</h2>
                        {filteredVenues.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center">
                                    <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">{searchTerm ? 'No venues found matching your search.' : 'No venues available.'}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} userLocation={userLocation} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="mb-4 text-2xl font-semibold">Map</h2>
                        <div className="h-96 overflow-hidden rounded-lg shadow-lg">
                            {loading ? (
                                <div className="flex h-full items-center justify-center bg-gray-200">Loading map...</div>
                            ) : (
                                <VenueMap venues={filteredVenues} userLocation={userLocation} />
                            )}
                        </div>
                        {userLocation && (
                            <p className="mt-2 text-sm text-gray-600">
                                Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
