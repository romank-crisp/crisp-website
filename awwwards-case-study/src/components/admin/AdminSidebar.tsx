"use client";

import { clsx } from "clsx";
import { MapPin, Layers, FileText, Users, Navigation, LayoutTemplate, ChevronRight, ChevronDown } from "lucide-react";

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MENU_GROUPS = [
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
                ]
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
                ]
            },
            {
                id: "works-group",
                label: "Works Page",
                icon: FileText,
                children: [
                    { id: "works", label: "Works List" },
                    { id: "works-content", label: "Page Content" },
                ]
            },
            {
                id: "ai-visual-content-group",
                label: "AI Visual Content",
                icon: FileText,
                children: [
                    { id: "aivisuals.json", label: "Hero" },
                    { id: "aivisuals-what-we-offer.json", label: "What We Offer" },
                    { id: "aivisuals-video-scroll.json", label: "Video Scroll" },
                    { id: "aivisuals-timeline.json", label: "Timeline" },
                    { id: "aivisuals-price-calculator.json", label: "Price Calculator" },
                    { id: "aivisuals-made-by-team.json", label: "Made by Team" },
                    { id: "aivisuals-faq.json", label: "FAQ" },
                ]
            }
        ]
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
                ]
            },
            {
                id: "case-studies/folkeuniversitetet",
                label: "Folkeuniversitetet",
                icon: FileText,
                children: [
                    { id: "case-studies/folkeuniversitetet-general.json", label: "General" },
                    { id: "case-studies/folkeuniversitetet-case-details.json", label: "Details" },
                    { id: "case-studies/folkeuniversitetet-case-stats.json", label: "Stats" },
                ]
            },
            {
                id: "case-studies/theytalk",
                label: "TheyTalk",
                icon: FileText,
                children: [
                    { id: "case-studies/theytalk-general.json", label: "General" },
                    { id: "case-studies/theytalk-case-details.json", label: "Details" },
                    { id: "case-studies/theytalk-case-stats.json", label: "Stats" },
                ]
            }
        ]
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
                ]
            },
            {
                id: "seo-case-studies",
                label: "Case Studies SEO",
                icon: FileText,
                children: [
                    { id: "seo/seo-centrogreen.json", label: "CentroGreen" },
                    { id: "seo/seo-folkeuniversitetet.json", label: "Folkeuniversitetet" },
                    { id: "seo/seo-theytalk.json", label: "TheyTalk" },
                ]
            }
        ]
    },
    {
        title: "Shared",
        items: [
            { id: "navigation", label: "Navigation", icon: Navigation },
            { id: "footer", label: "Footer", icon: LayoutTemplate },
            { id: "patterns.json", label: "Pattern Blocks", icon: Layers },
        ]
    }
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    // We can maintain local state for expanded items if needed, or derived from activeTab
    // Simple approach: Toggle expansion on click. 
    // Usually we want the active item's parent to be expanded by default.

    // Check if a parent contains the active tab
    const isActiveParent = (children: any[]) => children.some(c => c.id === activeTab);

    return (
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col h-full min-h-[calc(100vh-80px)]">
            <nav className="flex-1 overflow-y-auto px-4 py-8">
                {MENU_GROUPS.map((group) => (
                    <div key={group.title || "main"} className="mb-8 last:mb-0">
                        {group.title && (
                            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item: any) => {
                                // If nested
                                if (item.children) {
                                    const isParentActive = isActiveParent(item.children);
                                    // We can use a simple details/summary or controlled state.
                                    // For simplicity and cleaner DOM, let's just expanded it if active or user clicks.
                                    // But since we don't have complex state here, let's use <details> for native behavior 
                                    // OR just list them if it's simpler. 
                                    // User asked: "When we click on master tab, a sub tabs with related json opened"

                                    // Let's use a controlled component approach via a small internal wrapper or just logic here.
                                    // Given no internal state, <details> is easiest for "click to open", 
                                    // but we want it open if active.

                                    return (
                                        <SidebarGroup
                                            key={item.id}
                                            item={item}
                                            activeTab={activeTab}
                                            onTabChange={onTabChange}
                                        />
                                    );
                                }

                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onTabChange(item.id)}
                                        className={clsx(
                                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
                                            isActive
                                                ? "bg-black text-white"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-black"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
            <div className="p-8 pt-4 text-xs text-gray-300">
                v1.0.0
            </div>
        </div>
    );
}

// Helper for nested groups
function SidebarGroup({ item, activeTab, onTabChange }: { item: any, activeTab: string, onTabChange: (id: string) => void }) {
    // Check if any child is active to auto-expand
    const isChildActive = item.children.some((c: any) => c.id === activeTab);

    // We want to be able to toggle it. 
    // Using a simple <details> might be tricky to style perfectly or animate, 
    // but <details open={...}> works if we control it or leave it uncontrolled.
    // Let's force open if child active.

    return (
        <details className="group" open={isChildActive}>
            <summary className="list-none">
                <div
                    className={clsx(
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors rounded-lg cursor-pointer",
                        isChildActive
                            ? "text-black bg-gray-50"
                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        {item.label}
                    </div>
                    {/* Arrow icon that rotates */}
                    <ChevronRight size={14} className="transition-transform group-open:rotate-90 text-gray-400" />
                </div>
            </summary>
            <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1 pb-2">
                {item.children.map((child: any) => {
                    const isActive = activeTab === child.id;
                    return (
                        <button
                            key={child.id}
                            onClick={() => onTabChange(child.id)}
                            className={clsx(
                                "w-full text-left px-3 py-2 text-xs font-medium transition-colors rounded-md truncate",
                                isActive
                                    ? "bg-black text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                            )}
                        >
                            {child.label}
                        </button>
                    );
                })}
            </div>
        </details>
    );
}
