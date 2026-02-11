"use client";

import React from "react";
import { TextReveal } from "@/components/blocks/TextReveal";

import { companyLogos as COMPANY_LOGOS } from "@/content/clients";

export function ClientLogos() {
    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">


                {/* Company Logos Grid */}
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-5">
                        {COMPANY_LOGOS.map((logo, index) => {
                            const Content = () => (
                                <div
                                    className="aspect-square bg-transparent flex items-center justify-center p-6 md:p-8 border-[1px] border-gray-200 -ml-[1px] -mt-[1px] group"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={logo.src}
                                            alt={logo.name}
                                            className="max-w-full max-h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            );

                            return logo.url ? (
                                <a
                                    key={index}
                                    href={logo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Content />
                                </a>
                            ) : (
                                <div key={index}>
                                    <Content />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
