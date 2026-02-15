"use client";

import React from "react";

import { ClientLogo } from "@/content/clients";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";

export const SharedClientLogos = ({ data }: { data: ClientLogo[] }) => {
    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-[1475px] mx-auto px-4 md:px-0">


                {/* Company Logos Grid */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-2 md:grid-cols-5">
                        {data.slice(0, 16).map((logo, index) => {
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

                {/* Mobile Slider (2x2 Grid Pages) */}
                <div className="md:hidden">
                    <MobileLogoSlider data={data.slice(0, 16)} />
                </div>
            </div>
        </section>
    );
}

function MobileLogoSlider({ data }: { data: ClientLogo[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
        if (!emblaApi) return;

        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    // Chunk data into groups of 4 (2x2)
    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }

    return (
        <div className="w-full">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {chunks.map((chunk, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                            <div className="grid grid-cols-2">
                                {chunk.map((logo, j) => (
                                    <div
                                        key={j}
                                        className="aspect-square border border-gray-100 flex items-center justify-center p-8 -mr-[1px] -mb-[1px]"
                                    >
                                        <img
                                            src={logo.src}
                                            alt={logo.name}
                                            className="max-w-full max-h-full object-contain opacity-60"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={clsx(
                            "w-2 h-2 rounded-full transition-colors",
                            index === selectedIndex ? "bg-black" : "bg-gray-200"
                        )}
                        onClick={() => emblaApi?.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
