'use client';
import { UserLocation, Venue } from '@/types/venue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface VenueMapProps {
    venues: Venue[];
    userLocation: UserLocation | null;
}

const VenueMap: React.FC<VenueMapProps> = ({ venues, userLocation }) => {
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

    const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [-8.9094, 33.4608];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="rounded-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            {venues.map(
                (venue) =>
                    venue.latitude &&
                    venue.longitude && (
                        <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
                            <Popup>
                                <b>{venue.name}</b>
                                <br />
                                {venue.description}
                            </Popup>
                        </Marker>
                    ),
            )}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                        className: 'bg-blue-500 rounded-full w-3 h-3',
                        iconSize: [12, 12],
                    })}
                >
                    <Popup>Your Location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default VenueMap;
