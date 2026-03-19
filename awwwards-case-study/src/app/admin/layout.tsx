export const dynamic = 'force-dynamic';

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <AdminAuthGate>{children}</AdminAuthGate>;
}
