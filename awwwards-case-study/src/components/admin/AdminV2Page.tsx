"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { readContent, updateContent } from "@/app/actions/content";
import { SectionEditor } from "@/components/admin/FormEditor";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import {
    FileText,
    Navigation,
    LayoutTemplate,
    Search,
    ChevronDown,
    ChevronRight,
    Save,
    Loader2,
} from "lucide-react";

/* ─── Section definition ─────────────────────────────────────────── */

interface SectionDef {
    id: string;       // filename without .json
    label: string;
    previewUrl?: string;
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
            { id: "home-hero.json", label: "Hero Section", previewUrl: "/pattern-library/preview/SharedServicesHero" },
            { id: "home-services.json", label: "Services", previewUrl: "/pattern-library/preview/HomeWhereWeCanHelp" },
            { id: "home-quote.json", label: "Centered Quote", previewUrl: "/pattern-library/preview/SharedCenteredQuote" },
            { id: "home-partner.json", label: "Partner Statement", previewUrl: "/pattern-library/preview/HomePartnerStatement" },
            { id: "home-clients.json", label: "Clients", previewUrl: "/pattern-library/preview/SharedClientLogos" },
            { id: "home-stats.json", label: "Stats", previewUrl: "/pattern-library/preview/SharedStatsBlock" },
            { id: "home-testimonials.json", label: "Testimonials", previewUrl: "/pattern-library/preview/SharedTestimonials" },
            { id: "home-faq.json", label: "FAQ Section", previewUrl: "/pattern-library/preview/SharedFAQ" },
        ],
    },
    {
        id: "about",
        label: "About Us",
        icon: FileText,
        pageUrl: "/about",
        sections: [
            { id: "about.json", label: "About Page", previewUrl: "/pattern-library/preview/AboutPlaneHero" },
            { id: "about-capabilities.json", label: "Capabilities", previewUrl: "/pattern-library/preview/AboutServicesList" },
            { id: "locations.json", label: "Locations", previewUrl: "/pattern-library/preview/AboutLocationsMap" },
            { id: "services.json", label: "Services", previewUrl: "/pattern-library/preview/AboutServicesList" },
            { id: "clients.json", label: "Clients", previewUrl: "/pattern-library/preview/SharedClientLogos" },
            { id: "team.json", label: "Team", previewUrl: "/pattern-library/preview/AboutTeamAccordion" },
        ],
    },
    {
        id: "works",
        label: "Works Page",
        icon: FileText,
        pageUrl: "/works",
        sections: [
            { id: "works.json", label: "Works List", previewUrl: "/works" },
            { id: "works-content.json", label: "Page Content", previewUrl: "/works" },
        ],
    },
    {
        id: "ai-visuals",
        label: "AI Visual Content",
        icon: FileText,
        pageUrl: "/service/ai-visual-content",
        sections: [
            { id: "aivisuals.json", label: "Hero", previewUrl: "/pattern-library/preview/AIVisualHeaderZoom" },
            { id: "aivisuals-what-we-offer.json", label: "What We Offer", previewUrl: "/service/ai-visual-content" },
            { id: "aivisuals-video-scroll.json", label: "Video Scroll", previewUrl: "/pattern-library/preview/AIVisualVideoScroll" },
            { id: "aivisuals-timeline.json", label: "Timeline", previewUrl: "/pattern-library/preview/AIVisualTimeline" },
            { id: "aivisuals-made-by-team.json", label: "Made by Team", previewUrl: "/pattern-library/preview/AIVisualMadeByTeam" },
            { id: "aivisuals-price-calculator.json", label: "Price Calculator", previewUrl: "/pattern-library/preview/AIVisualPriceCalculatorV2" },
            { id: "aivisuals-faq.json", label: "FAQ", previewUrl: "/pattern-library/preview/SharedFAQ" },
            { id: "aivisuals-cta.json", label: "Video CTA", previewUrl: "/pattern-library/preview/SharedVideoScrollingCTA" },
        ],
    },
    {
        id: "centrogreen",
        label: "CentroGreen",
        icon: FileText,
        pageUrl: "/works/centrogreen",
        sections: [
            { id: "case-studies/centrogreen-general.json", label: "General", previewUrl: "/pattern-library/preview/CaseStudyHeroVideo" },
            { id: "case-studies/centrogreen-case-details.json", label: "Details", previewUrl: "/pattern-library/preview/CaseStudyDetails" },
            { id: "case-studies/centrogreen-case-stats.json", label: "Stats", previewUrl: "/pattern-library/preview/SharedStatsBlock" },
        ],
    },
    {
        id: "folkeuniversitetet",
        label: "Folkeuniversitetet",
        icon: FileText,
        pageUrl: "/works/folkeuniversitetet",
        sections: [
            { id: "case-studies/folkeuniversitetet-general.json", label: "General", previewUrl: "/pattern-library/preview/CaseStudyHeroVideo" },
            { id: "case-studies/folkeuniversitetet-case-details.json", label: "Details", previewUrl: "/pattern-library/preview/CaseStudyDetails" },
            { id: "case-studies/folkeuniversitetet-case-stats.json", label: "Stats", previewUrl: "/pattern-library/preview/SharedStatsBlock" },
        ],
    },
    {
        id: "theytalk",
        label: "TheyTalk",
        icon: FileText,
        pageUrl: "/works/theytalk",
        sections: [
            { id: "case-studies/theytalk-general.json", label: "General", previewUrl: "/pattern-library/preview/CaseStudyHeroVideo" },
            { id: "case-studies/theytalk-case-details.json", label: "Details", previewUrl: "/pattern-library/preview/CaseStudyDetails" },
            { id: "case-studies/theytalk-case-stats.json", label: "Stats", previewUrl: "/pattern-library/preview/SharedStatsBlock" },
        ],
    },
    {
        id: "seo",
        label: "SEO Settings",
        icon: Search,
        sections: [
            { id: "seo/seo-home.json", label: "Home", previewUrl: "/" },
            { id: "seo/seo-about.json", label: "About", previewUrl: "/about" },
            { id: "seo/seo-aivisuals.json", label: "Services", previewUrl: "/service/ai-visual-content" },
            { id: "seo/seo-works.json", label: "Works", previewUrl: "/works" },
            { id: "seo/seo-contact.json", label: "Contact", previewUrl: "/contact" },
            { id: "seo/seo-privacy-policy.json", label: "Privacy Policy", previewUrl: "/privacy-policy" },
            { id: "seo/seo-centrogreen.json", label: "CentroGreen", previewUrl: "/works/centrogreen" },
            { id: "seo/seo-folkeuniversitetet.json", label: "Folkeuniversitetet", previewUrl: "/works/folkeuniversitetet" },
            { id: "seo/seo-theytalk.json", label: "TheyTalk", previewUrl: "/works/theytalk" },
        ],
    },
    {
        id: "navigation",
        label: "Navigation",
        icon: Navigation,
        sections: [
            { id: "navigation.json", label: "Navigation", previewUrl: "/" },
        ],
    },
    {
        id: "footer",
        label: "Footer",
        icon: LayoutTemplate,
        sections: [
            { id: "footer.json", label: "Footer", previewUrl: "/" },
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

/* ─── Section Panel (two-column: editor | preview) ───────────────── */

function SectionPanel({
    section,
    data,
    onDataChange,
    onSave,
    saving,
    isActive,
    onActivate,
}: {
    section: SectionDef;
    data: any;
    onDataChange: (newData: any) => void;
    onSave: () => void;
    saving: boolean;
    isActive: boolean;
    onActivate: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        const willExpand = !expanded;
        setExpanded(willExpand);
        if (willExpand) {
            onActivate();
            // Scroll into view when expanding
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    };

    return (
        <div
            ref={sectionRef}
            className={`border rounded-xl overflow-hidden transition-all ${isActive
                    ? "border-black/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
        >
            {/* Section header */}
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${expanded
                        ? "bg-gray-50 border-b border-gray-200"
                        : "bg-white hover:bg-gray-50/50"
                    }`}
            >
                <span className="text-gray-400 transition-transform">
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                <span className="font-heading text-sm font-bold text-gray-800 uppercase tracking-wide flex-1">
                    {section.label}
                </span>
                {expanded && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSave();
                        }}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-black rounded-lg
                                   hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                    >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        {saving ? "Saving…" : "Save"}
                    </button>
                )}
            </button>

            {/* Section body: two-column */}
            {expanded && data !== undefined && (
                <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-200 min-h-[300px]">
                    {/* Left column: Editor */}
                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                        <SectionEditor
                            data={data}
                            onChange={onDataChange}
                            sectionId={section.id}
                        />
                    </div>

                    {/* Right column: Preview */}
                    <div className="bg-gray-50 relative min-h-[300px]">
                        {section.previewUrl ? (
                            <iframe
                                src={section.previewUrl}
                                className="w-full h-full min-h-[300px] border-none"
                                title={`Preview: ${section.label}`}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 font-text text-sm">
                                No preview available
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Loading placeholder */}
            {expanded && data === undefined && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={20} className="animate-spin text-gray-300" />
                </div>
            )}
        </div>
    );
}

/* ─── Admin V2 Page ──────────────────────────────────────────────── */

export function AdminV2Page() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialPage = searchParams.get("page") || "home";
    const [activePage, setActivePage] = useState(initialPage);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [sectionsData, setSectionsData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [savingSection, setSavingSection] = useState<string | null>(null);

    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "success",
        visible: false,
    });

    // Get current page definition
    const currentPage = PAGES.find((p) => p.id === activePage) || PAGES[0];

    // Handle page selection from sidebar
    const handlePageChange = useCallback(
        (pageId: string) => {
            setActivePage(pageId);
            setActiveSection(null);
            setSectionsData({});
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageId);
            window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
        },
        [searchParams, pathname]
    );

    // Load all sections for the current page
    useEffect(() => {
        const loadAllSections = async () => {
            setLoading(true);
            const results: Record<string, any> = {};
            const page = PAGES.find((p) => p.id === activePage);
            if (!page) return;

            await Promise.all(
                page.sections.map(async (section) => {
                    try {
                        const data = await readContent(section.id);
                        results[section.id] = data;
                    } catch (error) {
                        console.error(`Failed to load ${section.id}:`, error);
                        results[section.id] = null;
                    }
                })
            );

            setSectionsData(results);
            setLoading(false);
        };

        loadAllSections();
    }, [activePage]);

    // Update section data in local state
    const handleSectionDataChange = useCallback((sectionId: string, newData: any) => {
        setSectionsData((prev) => ({ ...prev, [sectionId]: newData }));
    }, []);

    // Save a single section
    const handleSaveSection = useCallback(
        async (sectionId: string) => {
            setSavingSection(sectionId);
            try {
                const data = sectionsData[sectionId];
                await updateContent(sectionId, data);
                setToast({ message: `Saved ${sectionId}`, type: "success", visible: true });
            } catch (error) {
                console.error(`Failed to save ${sectionId}:`, error);
                setToast({ message: `Failed to save ${sectionId}`, type: "error", visible: true });
            } finally {
                setSavingSection(null);
            }
        },
        [sectionsData]
    );

    // Cmd+S to save active section
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                if (activeSection) {
                    handleSaveSection(activeSection);
                }
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [activeSection, handleSaveSection]);

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
                    {/* Page header */}
                    <div className="flex items-center gap-4 mb-6 shrink-0">
                        <h1 className="font-heading text-2xl font-bold text-black">
                            {currentPage.label}
                        </h1>
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
                        <span className="ml-auto font-text text-xs text-gray-400">
                            {currentPage.sections.length} sections
                        </span>
                    </div>

                    {/* Sections list */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-gray-300" />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {currentPage.sections.map((section) => (
                                <SectionPanel
                                    key={section.id}
                                    section={section}
                                    data={sectionsData[section.id]}
                                    onDataChange={(newData) =>
                                        handleSectionDataChange(section.id, newData)
                                    }
                                    onSave={() => handleSaveSection(section.id)}
                                    saving={savingSection === section.id}
                                    isActive={activeSection === section.id}
                                    onActivate={() => setActiveSection(section.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
                `}</style>
            </AdminLayout>
        </>
    );
}
