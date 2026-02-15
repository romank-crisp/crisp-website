import AboutPage from './about-page';
import { readContent } from '@/app/actions/content';
import { parseSeoData } from "@/lib/seo";
import { SeoData } from "@/types/seo";

export async function generateMetadata() {
    const seoData = await readContent("seo/seo-about.json") as SeoData;
    return parseSeoData(seoData);
}

export default async function Page() {
    const aboutData = await readContent("about.json");
    const clientsData = await readContent("clients.json");
    const locationsData = await readContent("locations.json");
    const servicesData = await readContent("services.json");
    const teamData = await readContent("team.json");

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
