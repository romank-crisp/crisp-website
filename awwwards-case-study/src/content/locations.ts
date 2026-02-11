
import locationsData from "./data/locations.json";

export interface LocationCity {
    name: string;
}

export interface Location {
    id: string;
    label: string;
    x: number;
    y: number;
    cities?: string[];
}

// Location data - sourced from JSON
export const locations: Location[] = locationsData as Location[];
