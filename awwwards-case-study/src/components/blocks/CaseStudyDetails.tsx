"use client";

import React from "react";

import { CaseStudyDetailsProps } from "@/types/case-study";

export function CaseStudyDetails({ intro, sections, sidebar }: CaseStudyDetailsProps) {
    return (
        <section className="w-full py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">

                    {/* Left Column: Content */}
                    <div className="flex-1 md:w-2/3 space-y-32">
                        <h2 className="font-heading text-h2 text-text">
                            {intro}
                        </h2>

                        <div className="w-full h-px bg-text/10" />

                        <div className="space-y-32">
                            {sections.map((section, index) => (
                                <section key={index} className="space-y-8">
                                    <h3 className="font-heading text-sm font-medium text-text/50 uppercase tracking-wider">{section.title}</h3>
                                    <div className="font-text text-md text-text leading-relaxed">
                                        {section.content}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Divider (Hidden on mobile) */}
                    <div className="hidden md:block w-px bg-text/10" />

                    {/* Right Column: Sidebar */}
                    <div className="md:w-1/3 lg:w-1/4 space-y-16 md:sticky md:top-32 self-start">
                        {sidebar.map((item, index) => (
                            <div key={index} className="space-y-4">
                                <h4 className={`font-heading text-sm font-medium uppercase tracking-wider ${item.isRed ? 'text-brand' : 'text-text/50'}`}>
                                    {item.label}
                                </h4>
                                <div className="font-text text-md text-text">
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