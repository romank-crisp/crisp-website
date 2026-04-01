

import AboutPage from './about-page';
import { readContentStatic } from '@/lib/content-static';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = readContentStatic("seo/seo-about.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const aboutData = readContentStatic("about.json");
    const clientsData = readContentStatic("clients.json");
    const locationsData = readContentStatic("locations.json");
    const servicesData = readContentStatic("about-capabilities.json");
    const teamData = readContentStatic("team.json");

    return (
        <AboutPage
            aboutData={aboutData}
            clientsData={clientsData}
            locationsData={locationsData}
            servicesData={servicesData}
            teamData={teamData}
        />
    );
}
