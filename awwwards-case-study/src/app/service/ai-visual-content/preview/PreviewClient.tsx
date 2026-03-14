"use client";

import { useState } from "react";
import { SharedServicesHero } from "@/components/blocks/SharedServicesHero";
import { SharedScrollRevealImage } from "@/components/blocks/SharedScrollRevealImage";
import { SharedContactForm } from "@/components/blocks/SharedContactForm";
import { SharedFAQ } from "@/components/blocks/SharedFAQ";

import { AIVisualProductInteractive } from "@/components/blocks/AIVisualProductInteractive";
import { AIVisualTimeline } from "@/components/blocks/AIVisualTimeline";
import { AIVisualPriceCalculator } from "@/components/blocks/AIVisualPriceCalculator";
import { AIVisualMadeByTeam } from "@/components/blocks/AIVisualMadeByTeam";

export default function PreviewClient({
    servicesData,
    faqData,
    productInteractiveData,
    timelineData,
    priceCalculatorData,
    madeByTeamData
}: any) {
    const [activeComponent, setActiveComponent] = useState<string>("SharedServicesHero");

    const components = [
        { id: "SharedServicesHero", label: "Services Hero", render: () => <SharedServicesHero data={servicesData.hero} /> },
        {
            id: "SharedScrollRevealImage", label: "Scroll Reveal Image", render: () => <SharedScrollRevealImage
                src={servicesData.scrollRevealImage?.src || "https://storage.googleapis.com/crisp-website-485112_cloudbuild/img/home-hero/home-hero-03.png"}
                alt={servicesData.scrollRevealImage?.alt || "AI Assisted Visual Content"}
                mode="cover"
            />
        },

        { id: "AIVisualProductInteractive", label: "Product Interactive", render: () => productInteractiveData ? <AIVisualProductInteractive data={productInteractiveData} /> : <div>No Data</div> },
        { id: "AIVisualTimeline", label: "Timeline", render: () => timelineData ? <AIVisualTimeline data={timelineData} /> : <div>No Data</div> },
        { id: "AIVisualPriceCalculator", label: "Price Calculator", render: () => <AIVisualPriceCalculator data={priceCalculatorData} /> },
        { id: "AIVisualMadeByTeam", label: "Made By Team", render: () => <AIVisualMadeByTeam data={madeByTeamData} /> },
        { id: "SharedContactForm", label: "Contact Form", render: () => <div className="bg-white text-black text-white-override"><SharedContactForm data={servicesData.contactForm} /></div> },
        { id: "SharedFAQ", label: "FAQ", render: () => <SharedFAQ data={faqData} forceLightMode={true} /> },
    ];

    const active = components.find(c => c.id === activeComponent);

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
            {/* Nav Menu */}
            <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-[9999] p-4 flex gap-2 flex-wrap items-center shadow-sm">
                <span className="font-bold mr-4 text-black uppercase tracking-wider text-xs">Isolate Preview:</span>

                {components.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setActiveComponent(c.id)}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${activeComponent === c.id
                            ? "bg-brand text-white font-medium"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Content Display Area */}
            <div className={`flex-1 w-full pt-20 flex flex-col items-center justify-start min-h-screen bg-neutral-100`}>
                <div className="w-full relative shadow-xl min-h-[50vh] bg-white text-text pb-48">
                    {active ? active.render() : <p className="p-20 text-center">No component selected.</p>}
                </div>
            </div>
        </div>
    );
}
