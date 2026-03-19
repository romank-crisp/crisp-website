export const dynamic = 'force-dynamic';

import React, { use } from "react";
import { ColorsSection } from "@/components/design-system/ColorsSection";
import { TypographySection } from "@/components/design-system/TypographySection";
import { SpacingSection } from "@/components/design-system/SpacingSection";
import { ButtonsSection } from "@/components/design-system/ButtonsSection";
import { InputsSection } from "@/components/design-system/InputsSection";
import { TagsSection } from "@/components/design-system/TagsSection";

const SECTIONS = {
    colors: <ColorsSection />,
    typography: <TypographySection />,
    spacing: <SpacingSection />,
    buttons: <ButtonsSection />,
    inputs: <InputsSection />,
    tags: <TagsSection />,
};

type SectionSlug = keyof typeof SECTIONS;

export default function DesignSystemPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const isValidSlug = (s: string): s is SectionSlug => s in SECTIONS;

    if (!isValidSlug(slug)) {
        return (
            <div className="min-h-screen bg-white text-text p-32 flex items-center justify-center">
                <p className="font-text opacity-60">Component not found: {slug}</p>
            </div>
        );
    }

    const content = SECTIONS[slug];

    return (
        <div className="min-h-screen bg-white text-text p-32 md:p-64 flex items-center justify-center">
            <div className="w-full max-w-[1400px]">
                {content}
            </div>
        </div>
    );
}
