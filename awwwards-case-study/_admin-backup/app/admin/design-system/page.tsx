"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import { Palette, Type, Maximize, MousePointerClick, TextCursorInput, Tag } from "lucide-react";

import { ColorsSection } from "@/components/design-system/ColorsSection";
import { TypographySection } from "@/components/design-system/TypographySection";
import { SpacingSection } from "@/components/design-system/SpacingSection";
import { ButtonsSection } from "@/components/design-system/ButtonsSection";
import { InputsSection } from "@/components/design-system/InputsSection";
import { TagsSection } from "@/components/design-system/TagsSection";

/* ─── Design‑System tree data ───────────────────────────────────── */

const DS_TREE: TreeGroup[] = [
    {
        title: "Tokens",
        items: [
            { id: "colors", label: "Colors", icon: Palette },
            { id: "typography", label: "Typography", icon: Type },
            { id: "spacing", label: "Spacing", icon: Maximize },
        ],
    },
    {
        title: "Components",
        items: [
            { id: "buttons", label: "Buttons", icon: MousePointerClick },
            { id: "inputs", label: "Inputs", icon: TextCursorInput },
            { id: "tags", label: "Tags", icon: Tag },
        ],
    },
];

/* ─── Section map ───────────────────────────────────────────────── */

const SECTION_MAP: Record<string, React.ComponentType> = {
    colors: ColorsSection,
    typography: TypographySection,
    spacing: SpacingSection,
    buttons: ButtonsSection,
    inputs: InputsSection,
    tags: TagsSection,
};

/* ─── Page ──────────────────────────────────────────────────────── */

export default function AdminDesignSystemPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialSection = searchParams.get("section") || "colors";
    const [activeSection, setActiveSection] = useState<string>(initialSection);

    // Sync URL when activeSection changes
    const updateUrl = useCallback((section: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("section", section);
        window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }, [searchParams, pathname]);

    // Intersection Observer to update active tab on scroll
    useEffect(() => {
        const sections = DS_TREE.flatMap(group => group.items).map(item => `ds-section-${item.id}`);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id.replace("ds-section-", "");
                        setActiveSection(id);
                        updateUrl(id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-20% 0px -80% 0px", // Trigger when element hits top 20% of viewport
            }
        );

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleTreeSelect = (id: string) => {
        setActiveSection(id);
        updateUrl(id);
        const element = document.getElementById(`ds-section-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AdminLayout
            treeGroups={DS_TREE}
            activeTreeId={activeSection}
            onTreeSelect={handleTreeSelect}
            contentHeader="Design System"
            contentSubheader="Core tokens and reusable components"
        >
            <div className="max-w-5xl space-y-64 pb-32">
                {DS_TREE.flatMap(group => group.items).map((item) => {
                    // Extract id from the branch item or leaf item
                    const id = item.id;
                    const Component = SECTION_MAP[id];

                    if (!Component) return null;

                    return (
                        <section key={id} id={`ds-section-${id}`} className="scroll-mt-16">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h2 className="font-heading text-2xl text-black">
                                    {item.label}
                                </h2>
                            </div>
                            <Component />
                        </section>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
