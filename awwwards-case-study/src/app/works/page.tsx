import { WorksPage } from './works-page';
import { readContent } from '@/app/actions/content';

export default async function Page() {
    const clientsData = await readContent("clients.json");
    return <WorksPage clientsData={clientsData} />;
}
