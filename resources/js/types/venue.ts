export interface Venue {
    id: number;
    name: string;
    block_name?: string | null;
    description: string;
    latitude: number;
    longitude: number;
}

export interface UserLocation {
    lat: number;
    lng: number;
}
