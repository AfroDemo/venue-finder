'use client';
import { UserLocation, Venue } from '@/types/venue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface VenueMapProps {
    venues: Venue[];
    userLocation: UserLocation | null;
}

const VenueMap: React.FC<VenueMapProps> = ({ venues, userLocation }) => {
    return (
        <MapContainer center={[-8.9094, 33.4608]} zoom={13} style={{ height: '100%', width: '100%' }} className="rounded-lg">
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
