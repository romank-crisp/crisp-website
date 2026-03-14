"use client";

import { useEffect, useState } from "react";
import { readContent, updateContent } from "@/app/actions/content";
import { JsonEditor } from "@/components/admin/JsonEditor";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import { FileText, Navigation, LayoutTemplate } from "lucide-react";

/* ─── CMS tree data (migrated from AdminSidebar) ────────────────── */

const CMS_TREE: TreeGroup[] = [
    {
        title: "Pages",
        items: [
            {
                id: "home-group",
                label: "Home Page",
                icon: FileText,
                children: [
                    { id: "home-hero.json", label: "Hero Section" },
                    { id: "home-services.json", label: "Services" },
                    { id: "home-quote.json", label: "Centered Quote" },
                    { id: "home-partner.json", label: "Partner Statement" },
                    { id: "home-clients.json", label: "Clients" },
                    { id: "home-stats.json", label: "Stats" },
                    { id: "home-testimonials.json", label: "Testimonials" },
                    { id: "home-faq.json", label: "FAQ Section" },
                ],
            },

            {
                id: "about-us-group",
                label: "About Us",
                icon: FileText,
                children: [
                    { id: "about", label: "About Page" },
                    { id: "locations", label: "Locations" },
                    { id: "services", label: "Services" },
                    { id: "clients", label: "Clients" },
                    { id: "team", label: "Team" },
                ],
            },
            {
                id: "works-group",
                label: "Works Page",
                icon: FileText,
                children: [
                    { id: "works", label: "Works List" },
                    { id: "works-content", label: "Page Content" },
                ],
            },
            {
                id: "services-group",
                label: "Services",
                icon: FileText,
                children: [
                    { id: "services.json", label: "AI Visual Content" },
                ],
            },
        ],
    },
    {
        title: "Case Studies",
        items: [
            {
                id: "case-studies/centrogreen",
                label: "CentroGreen",
                icon: FileText,
                children: [
                    { id: "case-studies/centrogreen-general.json", label: "General" },
                    { id: "case-studies/centrogreen-case-details.json", label: "Details" },
                    { id: "case-studies/centrogreen-case-stats.json", label: "Stats" },
                ],
            },
            {
                id: "case-studies/folkeuniversitetet",
                label: "Folkeuniversitetet",
                icon: FileText,
                children: [
                    { id: "case-studies/folkeuniversitetet-general.json", label: "General" },
                    { id: "case-studies/folkeuniversitetet-case-details.json", label: "Details" },
                    { id: "case-studies/folkeuniversitetet-case-stats.json", label: "Stats" },
                ],
            },
            {
                id: "case-studies/theytalk",
                label: "TheyTalk",
                icon: FileText,
                children: [
                    { id: "case-studies/theytalk-general.json", label: "General" },
                    { id: "case-studies/theytalk-case-details.json", label: "Details" },
                    { id: "case-studies/theytalk-case-stats.json", label: "Stats" },
                ],
            },
        ],
    },
    {
        title: "SEO Settings",
        items: [
            {
                id: "seo-pages",
                label: "Page SEO",
                icon: FileText,
                children: [
                    { id: "seo/seo-home.json", label: "Home" },
                    { id: "seo/seo-about.json", label: "About" },
                    { id: "seo/seo-services.json", label: "Services" },
                    { id: "seo/seo-works.json", label: "Works" },
                    { id: "seo/seo-contact.json", label: "Contact" },
                    { id: "seo/seo-privacy-policy.json", label: "Privacy Policy" },
                ],
            },
            {
                id: "seo-case-studies",
                label: "Case Studies SEO",
                icon: FileText,
                children: [
                    { id: "seo/seo-centrogreen.json", label: "CentroGreen" },
                    { id: "seo/seo-folkeuniversitetet.json", label: "Folkeuniversitetet" },
                    { id: "seo/seo-theytalk.json", label: "TheyTalk" },
                ],
            },
        ],
    },
    {
        title: "Shared",
        items: [
            { id: "navigation", label: "Navigation", icon: Navigation },
            { id: "footer", label: "Footer", icon: LayoutTemplate },
        ],
    },
];

/* ─── CMS Admin Page ────────────────────────────────────────────── */

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("locations");
    const [currentData, setCurrentData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "success",
        visible: false,
    });

    const getFilename = (tab: string) => {
        if (tab.endsWith(".json")) return tab;
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
                    visible: true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadTabContent();
    }, [activeTab]);

    const handleSave = async (data: any) => {
        const filename = getFilename(activeTab);
        try {
            await updateContent(filename, data);
            setToast({ message: "Successfully saved", type: "success", visible: true });
            setCurrentData(data);
        } catch (error) {
            console.error("Failed to save", error);
            setToast({ message: "Failed to save changes", type: "error", visible: true });
        }
    };

    return (
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />

            <AdminLayout
                treeGroups={CMS_TREE}
                activeTreeId={activeTab}
                onTreeSelect={setActiveTab}
            >
                <div className="flex-1 overflow-hidden relative h-full flex flex-col">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="animate-pulse text-gray-400">Loading...</div>
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full">
                            <JsonEditor
                                key={activeTab}
                                filename={getFilename(activeTab)}
                                title={
                                    activeTab
                                        .split("/")
                                        .pop()
                                        ?.replace(".json", "")
                                        .replace("-", " ") || activeTab
                                }
                                liveUrl={
                                    activeTab.includes("case-studies")
                                        ? `/works/${activeTab
                                            .split("/")
                                            .pop()
                                            ?.replace("-general.json", "")
                                            .replace("-case-details.json", "")
                                            .replace("-case-stats.json", "")
                                            .replace(".json", "")}`
                                        : activeTab === "services.json"
                                            ? "/service/ai-visual-content"
                                            : activeTab === "clients"
                                                ? "/about#clients"
                                                : activeTab === "about"
                                                    ? "/about"
                                                    : activeTab === "services"
                                                        ? "/#services"
                                                        : activeTab === "locations"
                                                            ? "/about#locations"
                                                            : "/"
                                }
                                initialData={currentData || {}}
                                isEditable={!["navigation", "footer"].includes(activeTab)}
                                onSave={async (_, data) => {
                                    handleSave(data);
                                }}
                            />
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}
