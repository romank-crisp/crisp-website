"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ColorsSection } from "@/components/design-system/ColorsSection";
import { TypographySection } from "@/components/design-system/TypographySection";
import { SpacingSection } from "@/components/design-system/SpacingSection";
import { ButtonsSection } from "@/components/design-system/ButtonsSection";
import { InputsSection } from "@/components/design-system/InputsSection";
import { TagsSection } from "@/components/design-system/TagsSection";

export default function DesignSystemPage() {
    const [activeTab, setActiveTab] = useState("colors");

    const tabs = [
        { label: "Colors", value: "colors" },
        { label: "Typography", value: "typography" },
        { label: "Spacing", value: "spacing" },
        { label: "Buttons", value: "buttons" },
        { label: "Inputs", value: "inputs" },
        { label: "Tags", value: "tags" },
    ];

    return (
        <main className="min-h-screen bg-white text-text p-32 md:p-64 pt-[15vh]">


            <div className="flex flex-col gap-32 mb-64 border-b border-text/10 pb-32">
                <div>
                    <h1 className="font-heading text-h1 uppercase mb-8 text-brand">
                        Design<br />System
                    </h1>
                    <p className="font-text text-xl md:text-2xl opacity-60 max-w-2xl">
                        A comprehensive guide to our visual language, components, and interaction patterns.
                    </p>
                </div>

                <Tabs
                    items={tabs}
                    activeValue={activeTab}
                    onChange={setActiveTab}
                    className="w-fit"
                />
            </div>

            <section className="min-h-[50vh]">
                {/* Colors Section */}
                {activeTab === "colors" && <ColorsSection />}

                {/* Typography Section */}
                {activeTab === "typography" && <TypographySection />}

                {/* Spacing Section */}
                {activeTab === "spacing" && <SpacingSection />}

                {/* Button Section */}
                {activeTab === "buttons" && <ButtonsSection />}

                {/* Inputs Section */}
                {activeTab === "inputs" && <InputsSection />}

                {/* Tags Section */}
                {activeTab === "tags" && <TagsSection />}
            </section>
        </main>
    );
}

