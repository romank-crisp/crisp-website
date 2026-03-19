"use client";

import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { MediaConverter } from "@/components/admin/MediaConverter";

export default function ToolsPage() {
    return (
        <div className="h-[100dvh] w-full bg-[#f5f5f5] flex flex-col overflow-hidden">
            {/* Shared admin top navigation */}
            <AdminTopNav />

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="py-12 px-16">
                    <MediaConverter />
                </div>
            </main>
        </div>
    );
}
