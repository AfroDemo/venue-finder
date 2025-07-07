'use client';
import { UserLocation, Venue } from '@/types/venue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

interface VenueMapProps {
    venues: Venue[];
    userLocation: UserLocation | null;
    centerLocation?: { lat: number; lng: number };
    defaultZoom?: number;
    showUserRadius?: boolean;
    showDirections?: boolean;
}

// Mbeya University main campus coordinates
const CAMPUS_CENTER = { lat: -8.941767828794479, lng: 33.416173301851934 };

// Custom hook to update map center
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
};

// Custom hook for directions
const DirectionsLine = ({ userLocation, destination, show }: { userLocation: UserLocation | null; destination: Venue | null; show: boolean }) => {
    if (!show || !userLocation || !destination) return null;

    const positions: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [destination.latitude, destination.longitude],
    ];

    return (
        <Polyline
            positions={positions}
            pathOptions={{
                color: '#3B82F6',
                weight: 3,
                opacity: 0.8,
                dashArray: '10, 10',
            }}
        />
    );
};

const VenueMap: React.FC<VenueMapProps> = ({
    venues,
    userLocation,
    centerLocation = CAMPUS_CENTER,
    defaultZoom = 16,
    showUserRadius = true,
    showDirections = false,
}) => {
    const mapRef = useRef<L.Map | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [mapReady, setMapReady] = useState(false);

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
            setMapReady(true);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Create custom icons
    const venueIcon = L.divIcon({
        className: 'venue-marker',
        html: `
            <div style="
                background-color: #EF4444;
                border: 3px solid white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
                <div style="
                    background-color: white;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                "></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
            <div style="
                background-color: #3B82F6;
                border: 3px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            ">
                <div style="
                    background-color: white;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                "></div>
            </div>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    const selectedVenueIcon = L.divIcon({
        className: 'selected-venue-marker',
        html: `
            <div style="
                background-color: #10B981;
                border: 3px solid white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
                animation: bounce 1s infinite;
            ">
                <div style="
                    background-color: white;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                "></div>
            </div>
            <style>
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-5px); }
                    60% { transform: translateY(-3px); }
                }
            </style>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });

    // Calculate distance between two points
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Distance in meters
    };

    // Center the map on campus, but show user location if available
    const mapCenter: [number, number] = [centerLocation.lat, centerLocation.lng];

    if (!mapReady) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <MapContainer center={mapCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }} className="rounded-lg" ref={mapRef}>
                <MapController center={mapCenter} zoom={defaultZoom} />

                {/* Satellite view with fallback to OpenStreetMap */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="© Esri, Maxar, Earthstar Geographics"
                />

                {/* Campus boundary circle */}
                <Circle
                    center={mapCenter}
                    radius={1000}
                    pathOptions={{
                        color: '#3B82F6',
                        weight: 2,
                        opacity: 0.5,
                        fillColor: '#3B82F6',
                        fillOpacity: 0.1,
                    }}
                />

                {/* User location marker with accuracy radius */}
                {userLocation && (
                    <>
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup>
                                <div className="text-center">
                                    <strong className="text-blue-600">📍 Your Location</strong>
                                    <br />
                                    <small className="text-gray-600">
                                        {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                                    </small>
                                </div>
                            </Popup>
                        </Marker>

                        {/* User location accuracy circle */}
                        {showUserRadius && (
                            <Circle
                                center={[userLocation.lat, userLocation.lng]}
                                radius={50}
                                pathOptions={{
                                    color: '#3B82F6',
                                    weight: 1,
                                    opacity: 0.3,
                                    fillColor: '#3B82F6',
                                    fillOpacity: 0.1,
                                }}
                            />
                        )}
                    </>
                )}

                {/* Venue markers */}
                {venues.map((venue) => {
                    if (!venue.latitude || !venue.longitude) return null;

                    const isSelected = selectedVenue?.id === venue.id;
                    const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, venue.latitude, venue.longitude) : null;

                    return (
                        <Marker
                            key={venue.id}
                            position={[venue.latitude, venue.longitude]}
                            icon={isSelected ? selectedVenueIcon : venueIcon}
                            eventHandlers={{
                                click: () => setSelectedVenue(venue),
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px] p-2">
                                    <h3 className="mb-1 text-lg font-bold text-gray-800">🏢 {venue.name}</h3>

                                    {venue.block_name && <p className="mb-2 text-sm text-gray-600">📍 Block: {venue.block_name}</p>}

                                    <p className="mb-3 text-sm text-gray-700">{venue.description}</p>

                                    {distance && (
                                        <div className="mb-3 rounded bg-green-50 p-2">
                                            <p className="text-sm font-medium text-green-700">
                                                📏 Distance: {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedVenue(venue)}
                                            className="flex-1 rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
                                        >
                                            🎯 Focus
                                        </button>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 rounded bg-green-600 px-3 py-1 text-center text-sm text-white transition-colors hover:bg-green-700"
                                        >
                                            🧭 Navigate
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Direction line from user to selected venue */}
                <DirectionsLine userLocation={userLocation} destination={selectedVenue} show={showDirections} />
            </MapContainer>

            {/* Map controls overlay */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                {/* Campus center button */}
                <button
                    onClick={() => {
                        if (mapRef.current) {
                            // @ts-ignore
                            mapRef.current.setView(mapCenter, defaultZoom);
                        }
                    }}
                    className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-gray-50"
                    title="Center on Campus"
                >
                    🎯
                </button>

                {/* User location button */}
                {userLocation && (
                    <button
                        onClick={() => {
                            if (mapRef.current) {
                                // @ts-ignore
                                mapRef.current.setView([userLocation.lat, userLocation.lng], 17);
                            }
                        }}
                        className="rounded-lg bg-white p-2 shadow-lg transition-colors hover:bg-gray-50"
                        title="Go to My Location"
                    >
                        📍
                    </button>
                )}
            </div>

            {/* Venue counter */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white p-2 shadow-lg">
                <p className="text-sm font-medium text-gray-700">
                    🏢 {venues.length} venue{venues.length !== 1 ? 's' : ''} found
                </p>
            </div>
        </div>
    );
};

export default VenueMap;
