
import servicesData from "./data/services.json";

export interface Service {
    id: string;
    label: string;
    image: string;
    tags: string[];
    description: string;
}

export const services: Service[] = servicesData as Service[];
