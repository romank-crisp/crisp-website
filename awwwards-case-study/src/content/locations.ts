


export interface LocationData {
    locations: Location[];
    heading: {
        firstLine: string[]; // ["Based", "in", "EU."]
        secondLine: string[]; // ["Deliver", "Globally"]
    };
    description: string;
}

export interface Location {
    id: string;
    label: string;
    x: number;
    y: number;
    cities?: string[];
}
