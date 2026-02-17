"use client";

import React from "react";

import { CaseStudyDetailsProps } from "@/types/case-study";

export function CaseStudyDetails({ intro, sections, sidebar }: CaseStudyDetailsProps) {
    return (
        <section className="w-full py-64 bg-white border-t border-text/5">
            <div className="max-w-[1475px] mx-auto px-16 md:px-64">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">

                    {/* Left Column: Content */}
                    <div className="w-full md:w-2/3 md:pr-24 lg:pr-32">
                        <div className="max-w-[780px] space-y-64">
                            <h2 className="font-heading text-h2 text-text">
                                {intro}
                            </h2>

                            <div className="w-full h-px bg-text/10" />

                            <div className="space-y-64">
                                {sections.map((section, index) => (
                                    <section key={index} className="space-y-8">
                                        <h3 className="font-heading text-sm font-bold text-brand uppercase tracking-wider">{section.title}</h3>
                                        <div className="font-text text-text-md text-text">
                                            {section.type === 'deliverables' && section.items ? (
                                                <div className="flex flex-col">
                                                    {section.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-10 items-start py-20 border-t border-text/10 first:border-t-0">
                                                            <p className="font-heading text-h2 font-bold leading-none w-[60px] md:w-[80px] shrink-0">
                                                                {String(idx + 1).padStart(2, '0')}
                                                            </p>
                                                            <div className="flex flex-col gap-[10px]">
                                                                <h3 className="font-heading text-h3 font-bold leading-tight">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="font-text text-text-md text-text/80">
                                                                    {item.text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.type === 'html' ? (
                                                <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
                                            ) : (
                                                <p>{section.content}</p>
                                            )}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="w-full md:w-1/3 space-y-48 md:sticky md:top-32 self-start mt-24 md:mt-0 border-t md:border-t-0 md:border-l border-text/10 pt-32 md:pt-0 md:pl-24 lg:pl-32">
                        {sidebar.map((item, index) => (
                            <div key={index} className="space-y-8">
                                <h4 className={`font-heading text-sm font-bold uppercase tracking-wider ${item.isRed ? 'text-brand' : 'text-black'}`}>
                                    {item.label}
                                </h4>
                                <div className="font-text text-text-md text-text">
                                    {Array.isArray(item.value) ? (
                                        item.value.map((line, i) => <p key={i}>{line}</p>)
                                    ) : (
                                        <p>{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}