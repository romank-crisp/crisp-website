"use client";

import { useEffect, useState } from "react";
import { readContent, updateContent } from "@/app/actions/content";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { JsonEditor } from "@/components/admin/JsonEditor";
import { Toast, type ToastType } from "@/components/ui/Toast";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("locations");
    const [currentData, setCurrentData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Confirm-before-save state
    const [pendingSave, setPendingSave] = useState<{ data: any; filename: string } | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "success",
        visible: false,
    });

    // Initial load map to handle default tabs
    const getFilename = (tab: string) => {
        if (tab.endsWith('.json')) return tab;
        return `${tab}.json`;
    };

    useEffect(() => {
        const loadTabContent = async () => {
            setLoading(true);
            try {
                const filename = getFilename(activeTab);
                const data = await readContent(filename);
                setCurrentData(data);
            } catch (error) {
                console.error(`Failed to load data for ${activeTab}`, error);
                setToast({
                    message: `Failed to load content for ${activeTab}`,
                    type: "error",
                    visible: true
                });
            } finally {
                setLoading(false);
            }
        };

        loadTabContent();
    }, [activeTab]);

    // Step 1: Show confirmation dialog
    const handleSaveRequest = (data: any) => {
        const filename = getFilename(activeTab);
        setPendingSave({ data, filename });
    };

    // Step 2: User confirmed — actually write to GCS
    const handleConfirmSave = async () => {
        if (!pendingSave) return;
        const { data, filename } = pendingSave;
        setPendingSave(null);
        try {
            await updateContent(filename, data);
            setToast({ message: "Changes saved successfully", type: "success", visible: true });
            setCurrentData(data);
        } catch (error) {
            console.error("Failed to save", error);
            setToast({ message: "Failed to save changes", type: "error", visible: true });
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <div className="max-w-[1600px] mx-auto">
                <div className="bg-white border-t border-gray-200 overflow-hidden flex min-h-[800px]">
                    {/* Sidebar */}
                    <aside className="border-r border-gray-200">
                        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 p-8 bg-white overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-hidden relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                    <div className="animate-pulse text-gray-400">Loading...</div>
                                </div>
                            ) : (
                                <JsonEditor
                                    key={activeTab} // Force re-mount
                                    filename={getFilename(activeTab)}
                                    title={activeTab.split('/').pop()?.replace(".json", "").replace("-", " ") || activeTab}
                                    liveUrl={
                                        activeTab.includes("case-studies")
                                            ? `/works/${activeTab.split('/').pop()?.replace("-general.json", "").replace("-case-details.json", "").replace("-case-stats.json", "").replace(".json", "")}`
                                            : (activeTab === "clients") ? "/about#clients"
                                                : (activeTab === "about") ? "/about"
                                                    : (activeTab === "services") ? "/#services"
                                                        : (activeTab === "locations") ? "/about#locations"
                                                            : "/"
                                    }
                                    initialData={currentData || {}}
                                    onSave={async (_, data) => { handleSaveRequest(data); }}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Confirm Save Modal */}
            {pendingSave && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="font-heading text-h3 mb-2">Confirm Save</h2>
                        <p className="text-gray-500 mb-1 text-sm">
                            You are about to overwrite production data on Google Cloud Storage:
                        </p>
                        <p className="font-mono text-sm text-brand font-bold mb-6 bg-gray-50 rounded-lg px-3 py-2">
                            data/{pendingSave.filename}
                        </p>
                        <p className="text-gray-400 text-xs mb-6">
                            ⚠️ This will immediately affect the live website. Make sure your changes are correct.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPendingSave(null)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSave}
                                className="flex-1 px-4 py-3 rounded-xl bg-brand text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Save to Production
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
