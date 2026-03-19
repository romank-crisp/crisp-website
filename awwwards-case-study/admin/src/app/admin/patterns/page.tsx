export const dynamic = 'force-dynamic';

import AdminPatternsClient from "./AdminPatternsClient";
import { readContent } from "@/lib/content";

export default async function AdminPatternsPage() {
    const blocks = await readContent("patterns.json");

    return <AdminPatternsClient blocks={blocks} />;
}
