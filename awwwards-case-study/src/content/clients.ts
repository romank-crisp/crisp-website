
import clientsData from "./data/clients.json";

export interface ClientLogo {
    name: string;
    src: string;
    url: string | null;
}

export const companyLogos: ClientLogo[] = clientsData as ClientLogo[];
