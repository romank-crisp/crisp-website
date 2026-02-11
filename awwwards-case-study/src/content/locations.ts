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
