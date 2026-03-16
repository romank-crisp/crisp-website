"use client";

import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminTreeNav, type TreeGroup } from "@/components/admin/AdminTreeNav";

interface AdminLayoutProps {
    /** Tree navigation data for the left panel */
    treeGroups: TreeGroup[];
    /** Currently active tree item id */
    activeTreeId: string;
    /** Callback when a tree item is selected */
    onTreeSelect: (id: string) => void;
    /** Content to render in the main panel */
    children: React.ReactNode;
    /** Optional header for the content panel */
    contentHeader?: string;
    /** Optional subheader for the content panel */
    contentSubheader?: string;
    /** Optional panel to render on the far right (e.g. Page Builder) */
    rightPanel?: React.ReactNode;
}

export function AdminLayout({
    treeGroups,
    activeTreeId,
    onTreeSelect,
    children,
    contentHeader,
    contentSubheader,
    rightPanel,
}: AdminLayoutProps) {
    return (
        <div className="h-[100dvh] w-full bg-[#f5f5f5] flex flex-col overflow-hidden">
            {/* Global top navigation */}
            <AdminTopNav />

            {/* Two-column body */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left: Tree navigation */}
                <AdminTreeNav
                    groups={treeGroups}
                    activeId={activeTreeId}
                    onSelect={onTreeSelect}
                />

                {/* Main: Content panel */}
                <main className="flex-1 overflow-y-auto bg-white flex flex-col">
                    <div className="flex-1 py-6 px-8 flex flex-col">
                        {(contentHeader || contentSubheader) && (
                            <div className="mb-6">
                                {contentHeader && (
                                    <h1 className="font-heading text-2xl text-black">
                                        {contentHeader}
                                    </h1>
                                )}
                                {contentSubheader && (
                                    <p className="font-text text-sm text-gray-500 mt-1">
                                        {contentSubheader}
                                    </p>
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </main>

                {/* Optional Right Panel */}
                {rightPanel && rightPanel}
            </div>
        </div>
    );
}
