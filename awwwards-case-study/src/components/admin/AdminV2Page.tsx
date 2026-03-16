"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { readContent, updateContent } from "@/app/actions/content";
import { SectionEditor } from "@/components/admin/FormEditor";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import * as Accordion from "@radix-ui/react-accordion";
import {
    FileText,
    Navigation,
    LayoutTemplate,
    Search,
    ChevronDown,
    Save,
    Loader2,
} from "lucide-react";

/* ─── Section definition ─────────────────────────────────────────── */

interface SectionDef {
    id: string;       // filename without .json
    label: string;
}

interface PageDef {
    id: string;
    label: string;
    icon: any;
    sections: SectionDef[];
    pageUrl?: string;
}

/* ─── Pages with their sections ──────────────────────────────────── */

const PAGES: PageDef[] = [
    {
        id: "home",
        label: "Home Page",
        icon: FileText,
        pageUrl: "/",
        sections: [
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
        id: "about",
        label: "About Us",
        icon: FileText,
        pageUrl: "/about",
        sections: [
            { id: "about.json", label: "About Page" },
            { id: "about-capabilities.json", label: "Capabilities" },
            { id: "locations.json", label: "Locations" },
            { id: "services.json", label: "Services" },
            { id: "clients.json", label: "Clients" },
            { id: "team.json", label: "Team" },
        ],
    },
    {
        id: "works",
        label: "Works Page",
        icon: FileText,
        pageUrl: "/works",
        sections: [
            { id: "works.json", label: "Works List" },
            { id: "works-content.json", label: "Page Content" },
        ],
    },
    {
        id: "ai-visuals",
        label: "AI Visual Content",
        icon: FileText,
        pageUrl: "/service/ai-visual-content",
        sections: [
            { id: "aivisuals.json", label: "Hero" },
            { id: "aivisuals-what-we-offer.json", label: "What We Offer" },
            { id: "aivisuals-video-scroll.json", label: "Video Scroll" },
            { id: "aivisuals-timeline.json", label: "Timeline" },
            { id: "aivisuals-made-by-team.json", label: "Made by Team" },
            { id: "aivisuals-price-calculator.json", label: "Price Calculator" },
            { id: "aivisuals-faq.json", label: "FAQ" },
            { id: "aivisuals-cta.json", label: "Video CTA" },
        ],
    },
    {
        id: "centrogreen",
        label: "CentroGreen",
        icon: FileText,
        pageUrl: "/works/centrogreen",
        sections: [
            { id: "case-studies/centrogreen-general.json", label: "General" },
            { id: "case-studies/centrogreen-case-details.json", label: "Details" },
            { id: "case-studies/centrogreen-case-stats.json", label: "Stats" },
        ],
    },
    {
        id: "folkeuniversitetet",
        label: "Folkeuniversitetet",
        icon: FileText,
        pageUrl: "/works/folkeuniversitetet",
        sections: [
            { id: "case-studies/folkeuniversitetet-general.json", label: "General" },
            { id: "case-studies/folkeuniversitetet-case-details.json", label: "Details" },
            { id: "case-studies/folkeuniversitetet-case-stats.json", label: "Stats" },
        ],
    },
    {
        id: "theytalk",
        label: "TheyTalk",
        icon: FileText,
        pageUrl: "/works/theytalk",
        sections: [
            { id: "case-studies/theytalk-general.json", label: "General" },
            { id: "case-studies/theytalk-case-details.json", label: "Details" },
            { id: "case-studies/theytalk-case-stats.json", label: "Stats" },
        ],
    },
    {
        id: "seo",
        label: "SEO Settings",
        icon: Search,
        sections: [
            { id: "seo/seo-home.json", label: "Home" },
            { id: "seo/seo-about.json", label: "About" },
            { id: "seo/seo-aivisuals.json", label: "Services" },
            { id: "seo/seo-works.json", label: "Works" },
            { id: "seo/seo-contact.json", label: "Contact" },
            { id: "seo/seo-privacy-policy.json", label: "Privacy Policy" },
            { id: "seo/seo-centrogreen.json", label: "CentroGreen" },
            { id: "seo/seo-folkeuniversitetet.json", label: "Folkeuniversitetet" },
            { id: "seo/seo-theytalk.json", label: "TheyTalk" },
        ],
    },
    {
        id: "navigation",
        label: "Navigation",
        icon: Navigation,
        sections: [
            { id: "navigation.json", label: "Navigation" },
        ],
    },
    {
        id: "footer",
        label: "Footer",
        icon: LayoutTemplate,
        sections: [
            { id: "footer.json", label: "Footer" },
        ],
    },
];

/* ─── Convert to tree ────────────────────────────────────────────── */

const CMS_TREE: TreeGroup[] = [
    {
        title: "Pages",
        items: PAGES.filter((p) => ["home", "about", "works"].includes(p.id)).map((p) => ({
            id: p.id,
            label: p.label,
            icon: p.icon,
        })),
    },
    {
        title: "Services",
        items: PAGES.filter((p) => p.id === "ai-visuals").map((p) => ({
            id: p.id,
            label: p.label,
            icon: p.icon,
        })),
    },
    {
        title: "Case Studies",
        items: PAGES.filter((p) => ["centrogreen", "folkeuniversitetet", "theytalk"].includes(p.id)).map((p) => ({
            id: p.id,
            label: p.label,
            icon: p.icon,
        })),
    },
    {
        title: "Settings",
        items: PAGES.filter((p) => ["seo", "navigation", "footer"].includes(p.id)).map((p) => ({
            id: p.id,
            label: p.label,
            icon: p.icon,
        })),
    },
];

/* ─── Admin V2 Page ──────────────────────────────────────────────── */

export function AdminV2Page() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialPage = searchParams.get("page") || "home";
    const [activePage, setActivePage] = useState(initialPage);
    const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Track original loaded data to detect dirty state
    const originalDataRef = useRef<Record<string, string>>({});
    
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "success",
        visible: false,
    });

    // Get current page definition
    const currentPage = PAGES.find((p) => p.id === activePage) || PAGES[0];

    // Compute dirty sections
    const dirtySections = useMemo(() => {
        const dirty: string[] = [];
        for (const [sectionId, data] of Object.entries(sectionsData)) {
            const currentJson = JSON.stringify(data);
            if (originalDataRef.current[sectionId] !== currentJson) {
                dirty.push(sectionId);
            }
        }
        return dirty;
    }, [sectionsData]);

    const isDirty = dirtySections.length > 0;

    // Handle page selection from sidebar
    const handlePageChange = useCallback(
        (pageId: string) => {
            if (isDirty) {
                const shouldSwitch = window.confirm("You have unsaved changes. Switch anyway?");
                if (!shouldSwitch) return;
            }
            setActivePage(pageId);
            setSectionsData({});
            originalDataRef.current = {};
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageId);
            window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, isDirty]
    );

    // Load all sections for the current page
    useEffect(() => {
        const loadAllSections = async () => {
            setLoading(true);
            const results: Record<string, any> = {};
            const originals: Record<string, string> = {};
            const page = PAGES.find((p) => p.id === activePage);
            if (!page) return;

            await Promise.all(
                page.sections.map(async (section) => {
                    try {
                        const data = await readContent(section.id);
                        results[section.id] = data;
                        originals[section.id] = JSON.stringify(data);
                    } catch (error) {
                        console.error(`Failed to load ${section.id}:`, error);
                        results[section.id] = null;
                    }
                })
            );

            setSectionsData(results);
            originalDataRef.current = originals;
            setLoading(false);
        };

        loadAllSections();
    }, [activePage]);

    // Update section data in local state
    const handleSectionDataChange = useCallback((sectionId: string, newData: any) => {
        setSectionsData((prev) => ({ ...prev, [sectionId]: newData }));
    }, []);

    // Save ALL dirty sections at once
    const handleSaveAll = useCallback(async () => {
        if (dirtySections.length === 0) return;

        setSaving(true);
        let hasError = false;

        await Promise.all(
            dirtySections.map(async (sectionId) => {
                try {
                    const data = sectionsData[sectionId];
                    await updateContent(sectionId, data);
                    // Update the original reference so it's no longer dirty
                    originalDataRef.current[sectionId] = JSON.stringify(data);
                } catch (error) {
                    console.error(`Failed to save ${sectionId}:`, error);
                    hasError = true;
                }
            })
        );

        setSaving(false);
        // Force re-render to update dirty state
        setSectionsData((prev) => ({ ...prev }));

        if (hasError) {
            setToast({ message: "Some sections failed to save", type: "error", visible: true });
        } else {
            setToast({ message: `Saved ${dirtySections.length} section${dirtySections.length > 1 ? "s" : ""}`, type: "success", visible: true });
        }
    }, [dirtySections, sectionsData]);

    // Cmd+S to save all
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                handleSaveAll();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleSaveAll]);

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
                activeTreeId={activePage}
                onTreeSelect={handlePageChange}
            >
                <div className="flex-1 h-full flex flex-col min-h-0">
                    {/* Page header with Save button */}
                    <div className="flex items-center gap-4 mb-6 shrink-0">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-heading text-xl font-bold text-black">
                                {currentPage.label}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                {currentPage.pageUrl && (
                                    <a
                                        href={currentPage.pageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-text text-xs text-gray-400 hover:text-brand transition-colors underline underline-offset-2"
                                    >
                                        View live page →
                                    </a>
                                )}
                                <span className="font-text text-xs text-gray-300">
                                    {currentPage.sections.length} sections
                                </span>
                            </div>
                        </div>

                        {/* Dirty indicator + Save button */}
                        <div className="flex items-center gap-3 shrink-0">
                            {isDirty && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    {dirtySections.length} unsaved
                                </span>
                            )}
                            <button
                                onClick={handleSaveAll}
                                disabled={!isDirty || saving}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                                    isDirty
                                        ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? "Saving…" : "Save All"}
                            </button>
                        </div>
                    </div>

                    {/* Sections list */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-gray-300" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-1">
                            <Accordion.Root
                                type="multiple"
                                className="space-y-3"
                            >
                                {currentPage.sections.map((section) => {
                                    const sectionDirty = dirtySections.includes(section.id);

                                    return (
                                        <Accordion.Item
                                            key={section.id}
                                            value={section.id}
                                            className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm data-[state=open]:shadow-sm data-[state=open]:border-gray-300"
                                        >
                                            <Accordion.Trigger
                                                className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors
                                                           bg-white hover:bg-gray-50/50 cursor-pointer group
                                                           [&[data-state=open]]:bg-gray-50 [&[data-state=open]]:border-b [&[data-state=open]]:border-gray-200"
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className="text-gray-400 transition-transform duration-200
                                                               group-data-[state=closed]:-rotate-90 shrink-0"
                                                />
                                                <span className="font-heading text-sm font-bold text-gray-800 uppercase tracking-wide flex-1">
                                                    {section.label}
                                                </span>
                                                {sectionDirty && (
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                                )}
                                            </Accordion.Trigger>

                                            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                                {sectionsData[section.id] !== undefined ? (
                                                    <div className="p-5">
                                                        <SectionEditor
                                                            data={sectionsData[section.id]}
                                                            onChange={(newData) =>
                                                                handleSectionDataChange(section.id, newData)
                                                            }
                                                            sectionId={section.id}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 size={20} className="animate-spin text-gray-300" />
                                                    </div>
                                                )}
                                            </Accordion.Content>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion.Root>
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}
