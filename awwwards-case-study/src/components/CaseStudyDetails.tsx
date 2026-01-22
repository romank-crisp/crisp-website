"use client";

import React from "react";

interface Section {
    title: string;
    content: React.ReactNode;
}

interface SidebarItem {
    label: string;
    value: React.ReactNode;
    isRed?: boolean;
}

interface CaseStudyDetailsProps {
    intro: string;
    sections: Section[];
    sidebar: SidebarItem[];
}

export function CaseStudyDetails({ intro, sections, sidebar }: CaseStudyDetailsProps) {
    return (
        <section className="w-full py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">

                    {/* Left Column: Content */}
                    <div className="flex-1 md:w-2/3 space-y-12">
                        <h2 className="text-large text-black">
                            {intro}
                        </h2>

                        <div className="w-full h-px bg-black/10" />

                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <section key={index} className="space-y-4">
                                    <h3 className="text-label text-grey uppercase">{section.title}</h3>
                                    <div className="text-subheader text-black/80 leading-relaxed font-body">
                                        {section.content}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Divider (Hidden on mobile) */}
                    <div className="hidden md:block w-px bg-black/10" />

                    {/* Right Column: Sidebar */}
                    <div className="md:w-1/3 lg:w-1/4 space-y-10 md:sticky md:top-32 self-start">
                        {sidebar.map((item, index) => (
                            <div key={index} className="space-y-4">
                                <h4 className={`text-label uppercase ${item.isRed ? 'text-crisp-red' : 'text-grey'}`}>
                                    {item.label}
                                </h4>
                                <div className="text-subheader text-black">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}