export const dynamic = 'force-dynamic';

import PatternLibraryPage from "./pattern-library-page";
import { readContent } from "@/lib/content";

export default async function Page() {
    const blocks = await readContent("patterns.json");

    return <PatternLibraryPage blocks={blocks} />;
}
