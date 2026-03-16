"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { readContent, updateContent } from "@/app/actions/content";
import { FormEditor } from "@/components/admin/FormEditor";
import { Toast, type ToastType } from "@/components/ui/Toast";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import { FileText, Navigation, LayoutTemplate } from "lucide-react";

/* ─── CMS tree data (shared with V1) ────────────────────────────── */

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

/* ─── Block preview map ──────────────────────────────────────────── */

const BLOCK_PREVIEW_MAP: Record<string, string> = {
    "home-hero.json": "/pattern-library/preview/SharedServicesHero",
    "home-services.json": "/pattern-library/preview/HomeWhereWeCanHelp",
    "home-quote.json": "/pattern-library/preview/SharedCenteredQuote",
    "home-partner.json": "/pattern-library/preview/HomePartnerStatement",
    "home-clients.json": "/pattern-library/preview/SharedClientLogos",
    "home-stats.json": "/pattern-library/preview/SharedStatsBlock",
    "home-testimonials.json": "/pattern-library/preview/SharedTestimonials",
    "home-faq.json": "/pattern-library/preview/SharedFAQ",
    "about": "/pattern-library/preview/AboutPlaneHero",
    "about-capabilities.json": "/pattern-library/preview/AboutServicesList",
    "locations": "/pattern-library/preview/AboutLocationsMap",
    "services": "/pattern-library/preview/AboutServicesList",
    "clients": "/pattern-library/preview/SharedClientLogos",
    "team": "/pattern-library/preview/AboutTeamAccordion",
    "works": "/works",
    "works-content": "/works",
    "aivisuals.json": "/pattern-library/preview/AIVisualHeaderZoom",
    "aivisuals-what-we-offer.json": "/service/ai-visual-content",
    "aivisuals-video-scroll.json": "/pattern-library/preview/AIVisualVideoScroll",
    "aivisuals-timeline.json": "/pattern-library/preview/AIVisualTimeline",
    "aivisuals-price-calculator.json": "/pattern-library/preview/AIVisualPriceCalculatorV2",
    "aivisuals-made-by-team.json": "/pattern-library/preview/AIVisualMadeByTeam",
    "aivisuals-faq.json": "/pattern-library/preview/SharedFAQ",
    "aivisuals-cta.json": "/pattern-library/preview/SharedVideoScrollingCTA",
    "case-studies/centrogreen-general.json": "/pattern-library/preview/CaseStudyHeroVideo",
    "case-studies/centrogreen-case-details.json": "/pattern-library/preview/CaseStudyDetails",
    "case-studies/centrogreen-case-stats.json": "/pattern-library/preview/SharedStatsBlock",
    "case-studies/folkeuniversitetet-general.json": "/pattern-library/preview/CaseStudyHeroVideo",
    "case-studies/folkeuniversitetet-case-details.json": "/pattern-library/preview/CaseStudyDetails",
    "case-studies/folkeuniversitetet-case-stats.json": "/pattern-library/preview/SharedStatsBlock",
    "case-studies/theytalk-general.json": "/pattern-library/preview/CaseStudyHeroVideo",
    "case-studies/theytalk-case-details.json": "/pattern-library/preview/CaseStudyDetails",
    "case-studies/theytalk-case-stats.json": "/pattern-library/preview/SharedStatsBlock",
    "seo/seo-home.json": "/",
    "seo/seo-about.json": "/about",
    "seo/seo-aivisuals.json": "/service/ai-visual-content",
    "seo/seo-works.json": "/works",
    "seo/seo-contact.json": "/",
    "seo/seo-privacy-policy.json": "/privacy-policy",
    "seo/seo-centrogreen.json": "/works/centrogreen",
    "seo/seo-folkeuniversitetet.json": "/works/folkeuniversitetet",
    "seo/seo-theytalk.json": "/works/theytalk",
    "navigation": "/",
    "footer": "/",
};

function getBlockPreviewUrl(tab: string): string {
    return BLOCK_PREVIEW_MAP[tab] || "/";
}

/* ─── Admin V2 Page ──────────────────────────────────────────────── */

export function AdminV2Page() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialTab = searchParams.get("tab") || "home-hero.json";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [currentData, setCurrentData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({
        message: "",
        type: "success",
        visible: false,
    });

    const handleTabChange = useCallback(
        (tab: string) => {
            setActiveTab(tab);
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tab);
            window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
        },
        [searchParams, pathname]
    );

    const getFilename = (tab: string) => (tab.endsWith(".json") ? tab : `${tab}.json`);

    useEffect(() => {
        const loadTabContent = async () => {
            setLoading(true);
            setCurrentData(null);
            try {
                const filename = getFilename(activeTab);
                const data = await readContent(filename);
                setCurrentData(data);
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
                onTreeSelect={handleTabChange}
            >
                <div className="flex-1 overflow-hidden relative h-full flex flex-col">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="animate-pulse text-gray-400">Loading...</div>
                        </div>
                    ) : (
                        <div className="flex-1 h-full w-full">
                            <FormEditor
                                key={activeTab}
                                filename={getFilename(activeTab)}
                                title={
                                    activeTab
                                        .split("/")
                                        .pop()
                                        ?.replace(".json", "")
                                        .replace("-", " ") || activeTab
                                }
                                liveUrl={getBlockPreviewUrl(activeTab)}
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
