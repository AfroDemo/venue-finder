'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VenueMap from '@/components/VenueMap';
import Layout from '@/layouts/layout';
import { UserLocation, Venue } from '@/types/venue';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Home', href: '/' }];

interface HomePageProps {
    venues: Venue[];
    auth: { user: any } | null;
    flash: { success?: string; error?: string };
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
        <Card className="h-full transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {venue.name}
                </CardTitle>
                {venue.block_name && <CardDescription className="text-sm text-gray-600">Block: {venue.block_name}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="line-clamp-2 text-sm text-gray-700">{venue.description}</p>
                {distance !== null && (
                    <p className="text-sm font-medium text-green-600">
                        Distance: {distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`}
                    </p>
                )}
                <Button asChild variant="outline" className="w-full">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        Navigate
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function home({ venues, auth, flash }: HomePageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'distance'>('name');
    const [showMap, setShowMap] = useState(true);

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        setLoading(true);

        // Enhanced options for better accuracy
        const options = {
            enableHighAccuracy: true,
            timeout: 30000, // Increased timeout to 30 seconds
            maximumAge: 0, // Don't use cached location, always get fresh
        };

        // Try to get high accuracy location first
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                console.log('Location obtained:', {
                    latitude: latitude,
                    longitude: longitude,
                    accuracy: accuracy,
                    timestamp: new Date(position.timestamp).toLocaleString(),
                });

                // Check if accuracy is reasonable
                if (accuracy > 1000) {
                    console.warn('Location accuracy is low:', accuracy, 'meters');
                    // Show warning but still use the location
                    alert(`Location accuracy is low (${Math.round(accuracy)}m). Consider enabling high accuracy mode in your device settings.`);
                }

                setUserLocation({
                    lat: latitude,
                    lng: longitude,
                });
                setLoading(false);
            },
            (error) => {
                console.error('High accuracy geolocation failed:', error);

                // Fallback: Try with lower accuracy requirements
                const fallbackOptions = {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 300000, // 5 minutes cache is okay for fallback
                };

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;

                        console.log('Fallback location obtained:', {
                            latitude: latitude,
                            longitude: longitude,
                            accuracy: accuracy,
                        });

                        alert(
                            `Using approximate location (accuracy: ${Math.round(accuracy)}m). For better accuracy, enable high accuracy mode in your device settings.`,
                        );

                        setUserLocation({
                            lat: latitude,
                            lng: longitude,
                        });
                        setLoading(false);
                    },
                    (fallbackError) => {
                        console.error('Fallback geolocation also failed:', fallbackError);
                        handleGeolocationError(fallbackError);
                    },
                    fallbackOptions,
                );
            },
            options,
        );
    };

    const handleGeolocationError = (error) => {
        let errorMessage = 'Unable to get your location. ';
        let suggestions = '';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += 'Location access denied.';
                suggestions = 'Please enable location permissions in your browser and device settings.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information unavailable.';
                suggestions = 'Try moving to an area with better GPS reception or enable location services.';
                break;
            case error.TIMEOUT:
                errorMessage += 'Location request timed out.';
                suggestions = 'Please try again or move to an area with better GPS reception.';
                break;
            default:
                errorMessage += 'An unknown error occurred.';
                suggestions = 'Please try again later.';
                break;
        }

        alert(errorMessage + ' ' + suggestions);
        setLoading(false);
    };

    // Add a function to check location permissions
    const checkLocationPermissions = async () => {
        if ('permissions' in navigator) {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                console.log('Location permission status:', permission.state);

                if (permission.state === 'denied') {
                    alert('Location permissions are denied. Please enable them in your browser settings.');
                    return false;
                }
            } catch (error) {
                console.log('Could not check permissions:', error);
            }
        }
        return true;
    };

    // Enhanced refresh function
    const refreshLocation = async () => {
        console.log('Refreshing location...');
        const hasPermission = await checkLocationPermissions();
        if (hasPermission) {
            getUserLocation();
        }
    };

    // Add this function to provide manual location input as fallback
    const [showManualLocation, setShowManualLocation] = useState(false);
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');

    const setManualLocation = () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);

        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude values');
            return;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Please enter valid coordinate ranges (lat: -90 to 90, lng: -180 to 180)');
            return;
        }

        setUserLocation({ lat, lng });
        setShowManualLocation(false);
        alert('Manual location set successfully');
    };

    // Enhanced location info display
    const showLocationInfo = () => {
        if (userLocation) {
            const info = `
Current location: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}
Google Maps: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}
        `;
            alert(info);
        } else {
            alert('No location data available');
        }
    };

    const filteredVenues = venues
        .filter((venue) => venue.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'distance' && userLocation) {
                const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
                const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
                return distA - distB;
            }
            return a.name.localeCompare(b.name);
        });

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="MUST Venue Finder" />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-7xl p-4">
                    {/* Hero Section */}
                    <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-100 to-gray-100 py-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">MUST Venue Finder</h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
                            Easily find and navigate to venues on Mbeya University campus
                        </p>
                        {auth?.user && (
                            <div className="mt-4">
                                <Link href="/dashboard" className="font-medium text-blue-600 hover:underline">
                                    Go to Admin Dashboard
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Flash Messages */}
                    {flash.success && <div className="mb-6 rounded-md bg-green-100 p-4 text-green-700">{flash.success}</div>}
                    {flash.error && <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">{flash.error}</div>}

                    {/* Search and Sort */}
                    <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search venues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 text-base"
                            />
                        </div>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'distance')}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Sort by Name</SelectItem>
                                {userLocation && <SelectItem value="distance">Sort by Distance</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Venues and Map */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Venues ({filteredVenues.length})</h2>
                                <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)} className="lg:hidden">
                                    {showMap ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                                    {showMap ? 'Hide Map' : 'Show Map'}
                                </Button>
                            </div>
                            {filteredVenues.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <p className="text-gray-600">
                                            {searchTerm ? 'No venues found matching your search.' : 'No venues available.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {filteredVenues.map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} userLocation={userLocation} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`${showMap ? 'block' : 'hidden'} lg:block`}>
                            <h2 className="mb-4 text-xl font-semibold">Map</h2>
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
            </div>
        </Layout>
    );
}
