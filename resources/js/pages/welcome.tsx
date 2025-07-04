'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { UserLocation, Venue } from '@/types/venue';
import { router } from '@inertiajs/react';
import { Lock, MapPin, Plus, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import for VenueMap
const VenueMap = dynamic(() => import('@/components/VenueMap'), {
    ssr: false,
    loading: () => <div className="flex h-96 items-center justify-center rounded-lg bg-gray-200">Loading map...</div>,
});

// Leaflet icon fix
useEffect(() => {
    let isMounted = true;
    import('leaflet').then((L) => {
        if (!isMounted) return;
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    });
    return () => {
        isMounted = false;
    };
}, []);

// Haversine formula
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

export default function HomePage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [newVenue, setNewVenue] = useState<Partial<Venue>>({
        name: '',
        block_name: '',
        description: '',
        latitude: undefined,
        longitude: undefined,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVenues();
        getUserLocation();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await fetch('/venues');
            const data = await response.json();
            setVenues(data);
        } catch (error) {
            console.error('Error fetching venues:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleAdminLogin = () => {
        if (adminPassword === 'mustadmin123') {
            setIsAdmin(true);
            setAdminPassword('');
        } else {
            alert('Incorrect password');
        }
    };

    const handleAddVenue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const latitude = Number.parseFloat(newVenue.latitude as string);
            const longitude = Number.parseFloat(newVenue.longitude as string);
            if (isNaN(latitude) || isNaN(longitude)) {
                alert('Invalid latitude or longitude');
                return;
            }
            await router.post('/venues', {
                name: newVenue.name,
                block_name: newVenue.block_name || null,
                description: newVenue.description,
                latitude,
                longitude,
            });
            setNewVenue({
                name: '',
                block_name: '',
                description: '',
                latitude: undefined,
                longitude: undefined,
            });
            fetchVenues();
            alert('Venue added successfully!');
        } catch (error) {
            console.error('Error adding venue:', error);
            alert('Error adding venue');
        }
    };

    const filteredVenues = venues.filter((venue) => venue.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading venues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-7xl p-4">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900">MUST Venue Finder</h1>
                    <p className="text-lg text-gray-600">Find venues on Mbeya University campus</p>
                </div>
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
                <div className="mb-8">
                    <Card className="mx-auto max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Admin Panel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isAdmin ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="admin-password">Admin Password</Label>
                                        <Input
                                            id="admin-password"
                                            type="password"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            placeholder="Enter admin password"
                                        />
                                    </div>
                                    <Button onClick={handleAdminLogin} className="w-full">
                                        Login
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleAddVenue} className="space-y-4">
                                    <div>
                                        <Label htmlFor="venue-name">Venue Name *</Label>
                                        <Input
                                            id="venue-name"
                                            required
                                            value={newVenue.name}
                                            onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                                            placeholder="Enter venue name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="block-name">Block Name</Label>
                                        <Input
                                            id="block-name"
                                            value={newVenue.block_name}
                                            onChange={(e) => setNewVenue({ ...newVenue, block_name: e.target.value })}
                                            placeholder="Enter block name (optional)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            required
                                            value={newVenue.description}
                                            onChange={(e) => setNewVenue({ ...newVenue, description: e.target.value })}
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
                                                value={newVenue.latitude ?? ''}
                                                onChange={(e) => setNewVenue({ ...newVenue, latitude: e.target.value })}
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
                                                value={newVenue.longitude ?? ''}
                                                onChange={(e) => setNewVenue({ ...newVenue, longitude: e.target.value })}
                                                placeholder="33.4608"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Venue
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsAdmin(false)} className="w-full">
                                        Logout
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
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
                            <VenueMap venues={filteredVenues} userLocation={userLocation} />
                        </div>
                        {userLocation && (
                            <p className="mt-2 text-sm text-gray-600">
                                Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
