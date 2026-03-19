"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { readContent, updateContent } from "@/app/actions/content";
import { JsonEditor } from "@/components/admin/JsonEditor";
import { PriceCalculatorEditor } from "@/components/admin/PriceCalculatorEditor";
import { AdminV2Page } from "@/components/admin/AdminV2Page";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import { FileText, Navigation, LayoutTemplate, Save } from "lucide-react";

/* ─── Feature Flag: v1 (JSON editor) or v2 (GUI forms) ──────────── */
const USE_V2 = process.env.NEXT_PUBLIC_ADMIN_VERSION === "v2";

/* ─── CMS tree data ─────────────────────────────────────────────── */

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
                    { id: "about-capabilities.json", label: "Capabilities" },
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
        ],
    },
    {
        title: "Services",
        items: [
            {
                id: "ai-visual-content-group",
                label: "AI Visual Content",
                icon: FileText,
                children: [
                    { id: "aivisuals.json", label: "Hero" },
                    { id: "aivisuals-text-iteration.json", label: "Text Iteration" },
                    { id: "aivisuals-what-we-offer.json", label: "What We Offer" },
                    { id: "aivisuals-video-scroll.json", label: "Video Scroll" },
                    { id: "aivisuals-timeline.json", label: "Timeline" },
                    { id: "aivisuals-made-by-team.json", label: "Made by Team" },
                    { id: "aivisuals-price-calculator.json", label: "Price Calculator" },
                    { id: "aivisuals-faq.json", label: "FAQ" },
                    { id: "aivisuals-cta.json", label: "Video CTA" },
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
                    { id: "seo/seo-aivisuals.json", label: "Services" },
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
    /* V2 feature flag — render GUI editor instead */
    if (USE_V2) return <AdminV2Page />;

    /* ─── V1: Original JSON editor ──────────────────────────────── */
    const searchParams = useSearchParams();
    const pathname = usePathname();


    const initialTab = searchParams.get("tab") || "locations";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [currentData, setCurrentData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const editorDataRef = useRef<string>("");

    // Sync URL when activeTab changes
    const handleTabChange = useCallback((tab: string) => {
        // If there are unsaved changes, warn user
        if (isDirty) {
            const shouldSwitch = window.confirm("You have unsaved changes. Switch anyway?");
            if (!shouldSwitch) return;
        }
        setActiveTab(tab);
        setIsDirty(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }, [searchParams, pathname, isDirty]);


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
            setCurrentData(null);
            setIsDirty(false);
            try {
                const filename = getFilename(activeTab);
                const data = await readContent(filename);
                setCurrentData(data);
                editorDataRef.current = JSON.stringify(data, null, 2);
            } catch (error) {
                console.error(`Failed to load data for ${activeTab}`, error);
                setCurrentData(null);
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

    const handleSave = useCallback(async () => {
        if (!isDirty) return;
        const filename = getFilename(activeTab);
        setSaving(true);
        try {
            const parsed = JSON.parse(editorDataRef.current);
            await updateContent(filename, parsed);
            setCurrentData(parsed);
            setIsDirty(false);
            setToast({ message: "Successfully saved", type: "success", visible: true });
        } catch (error) {
            console.error("Failed to save", error);
            setToast({ message: "Failed to save changes", type: "error", visible: true });
        } finally {
            setSaving(false);
        }
    }, [activeTab, isDirty]);

    const handleEditorChange = useCallback((value: string) => {
        editorDataRef.current = value;
        setIsDirty(true);
    }, []);

    // Keyboard shortcut for Cmd+S / Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

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
                onTreeSelect={handleTabChange}
            >
                <div className="flex-1 overflow-hidden relative h-full flex flex-col">
                    {/* Page-level Save Button */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-center gap-3">
                            {isDirty && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Unsaved changes
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!isDirty || saving}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                                isDirty
                                    ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <Save size={16} />
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-pulse text-gray-400 font-text text-sm">Loading...</div>
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full min-h-0">
                            <JsonEditor
                                key={activeTab}
                                filename={getFilename(activeTab)}
                                title={
                                    activeTab
                                        .split("/")
                                        .pop()
                                        ?.replace(".json", "")
                                        .replace(/-/g, " ") || activeTab
                                }
                                initialData={currentData || {}}
                                isEditable={!["navigation", "footer"].includes(activeTab)}
                                onChange={handleEditorChange}
                                settingsPanel={
                                    activeTab === "aivisuals-price-calculator.json"
                                        ? <PriceCalculatorEditor
                                            key={`settings-${activeTab}`}
                                            data={currentData || {}}
                                            onSave={(data) => {
                                                editorDataRef.current = JSON.stringify(data, null, 2);
                                                setIsDirty(true);
                                            }}
                                        />
                                        : undefined
                                }
                            />
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}
