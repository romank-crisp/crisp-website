"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import { HomeFAQData } from "@/types/home";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const SharedFAQ = ({ data, forceLightMode = false }: { data: HomeFAQData, forceLightMode?: boolean }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const panelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const iconRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    useGSAP(() => {
        if (!sectionRef.current || forceLightMode) return;

        // Transition background color from White to Dark
        // and text from Dark to White
        gsap.fromTo(sectionRef.current,
            {
                backgroundColor: "rgb(255, 255, 255)",
                color: "rgb(18, 12, 42)"
            },
            {
                backgroundColor: "rgb(18, 12, 42)", // --color-text
                color: "rgb(255, 255, 255)", // white
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 40%",
                    scrub: true,
                }
            }
        );
    }, { scope: sectionRef });

    const toggleAccordion = (index: number) => {
        const isOpening = openIndex !== index;
        const previousIndex = openIndex;

        // Close previous panel
        if (previousIndex !== null && panelRefs.current.has(previousIndex)) {
            const prevPanel = panelRefs.current.get(previousIndex)!;
            const prevIcon = iconRefs.current.get(previousIndex);

            gsap.to(prevPanel, {
                height: 0,
                duration: 0.5,
                ease: "power3.inOut",
                overwrite: "auto"
            });
            if (prevIcon) {
                gsap.to(prevIcon, {
                    rotation: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
            }
        }

        // Open new panel
        if (isOpening && panelRefs.current.has(index)) {
            const panel = panelRefs.current.get(index)!;
            const icon = iconRefs.current.get(index);

            setOpenIndex(index);

            // Get auto height
            panel.style.height = "auto";
            const autoHeight = panel.offsetHeight;
            panel.style.height = "0px";

            gsap.to(panel, {
                height: autoHeight,
                duration: 0.5,
                ease: "power3.inOut",
                overwrite: "auto"
            });
            if (icon) {
                gsap.to(icon, {
                    rotation: 45,
                    duration: 0.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
            }
        } else {
            setOpenIndex(null);
        }
    };

    if (!data) return null;

    return (
        <section
            ref={sectionRef}
            className="pt-12 md:pt-[160px] pb-16 md:pb-[120px] bg-white relative z-10 transition-colors duration-500"
        >
            <div className="w-[1475px] max-w-full mx-auto flex flex-col md:flex-row gap-64 md:gap-48 px-16 md:px-64">

                {/* Left Column: H1 Header */}
                <div className="w-full md:w-1/3">
                    <h2
                        className="font-heading text-h1 font-bold leading-tight sticky top-128 mt-[36px]"
                        dangerouslySetInnerHTML={{ __html: data.title.replace(/\n/g, '<br/>') }}
                    />
                </div>

                {/* Right Column: Accordion */}
                <div className="w-full md:w-2/3">
                    <div className="space-y-0">
                        {data.items.map((item, index) => {
                            const isOpen = openIndex === index;
                            const panelId = `faq-panel-${index}`;

                            return (
                                <div
                                    key={index}
                                    className="border-t border-current/10 last:border-b"
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        className="w-full py-[16px] md:py-[48px] flex items-start justify-between gap-16 transition-all duration-300 focus:outline-none group text-left hover:pl-16"
                                    >
                                        <span className="font-text text-text-md md:text-text-lg transition-all duration-300 group-hover:text-brand">
                                            {item.question}
                                        </span>

                                        <div
                                            ref={(el) => {
                                                if (el) iconRefs.current.set(index, el);
                                            }}
                                            className="flex items-center justify-center flex-shrink-0 ml-4 mt-2 transition-transform duration-300 group-hover:scale-125"
                                        >
                                            <Plus className="w-24 h-24 md:w-32 md:h-32" />
                                        </div>
                                    </button>

                                    <div
                                        id={panelId}
                                        ref={(el) => {
                                            if (el) panelRefs.current.set(index, el);
                                        }}
                                        role="region"
                                        aria-labelledby={`faq-button-${index}`}
                                        className="overflow-hidden"
                                        style={{ height: 0 }}
                                    >
                                        <div className="pb-[16px] md:pb-[64px]">
                                            <p className="font-text text-text-sm md:text-text-md leading-relaxed opacity-70 w-full">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
