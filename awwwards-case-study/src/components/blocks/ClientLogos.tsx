"use client";

import React from "react";
import { TextReveal } from "@/components/blocks/TextReveal";

const COMPANY_LOGOS = [
    { name: "Client 1", src: "/img/client-logos/client-logo-01.svg" },
    { name: "Client 2", src: "/img/client-logos/client-logo-02.svg" },
    { name: "Client 3", src: "/img/client-logos/client-logo-03.svg" },
    { name: "Client 4", src: "/img/client-logos/client-logo-04.svg" },
    { name: "Client 5", src: "/img/client-logos/client-logo-05.svg" },
    { name: "Client 6", src: "/img/client-logos/client-logo-06.svg" },
    { name: "Client 7", src: "/img/client-logos/client-logo-07.svg" },
    { name: "Client 8", src: "/img/client-logos/client-logo-08.svg" },
    { name: "Client 9", src: "/img/client-logos/client-logo-09.svg" },
    { name: "Client 10", src: "/img/client-logos/client-logo-10.svg" },
    { name: "Client 11", src: "/img/client-logos/client-logo-11.svg" },
    { name: "Client 12", src: "/img/client-logos/client-logo-12.svg" },
    { name: "Client 13", src: "/img/client-logos/client-logo-13.svg" },
    { name: "Client 14", src: "/img/client-logos/client-logo-14.svg" },
    { name: "Client 15", src: "/img/client-logos/client-logo-15.svg" }
];

export function ClientLogos() {
    return (
        <section className="w-full bg-white py-20 md:py-32">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                {/* Company Description */}
                <div className="mb-12 md:mb-16">
                    <TextReveal
                        text="Your are in a good company, With more than 100+ project delivered, wide range of skills"
                        className="font-text text-text-lg text-left text-text/90 max-w-md"
                    />
                </div>

                {/* Company Logos Grid */}
                <div>
                    <div className="grid grid-cols-5">
                        {COMPANY_LOGOS.map((logo, index) => (
                            <div
                                key={index}
                                className="aspect-[295/244] bg-gray-50/50 flex items-center justify-center p-6 md:p-8 border-[1px] border-gray-200 -ml-[1px] -mt-[1px]"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.name}
                                    className="w-full h-full object-contain opacity-40 hover:opacity-100 transition-opacity duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
