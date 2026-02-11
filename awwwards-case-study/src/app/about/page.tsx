import AboutPage from './about-page';
import { readContent } from '@/app/actions/content';

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
