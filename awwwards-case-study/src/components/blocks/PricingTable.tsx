"use client";

import { PricingTableProps } from "@/types/case-study";
import { clsx } from "clsx";

export function PricingTable({ title, tiers }: PricingTableProps) {
    return (
        <div id="pricing" className="container mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
            {title && <h2 className="text-4xl md:text-6xl font-medium mb-16">{title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {tiers.map((tier, index) => {
                    const isHighlight = tier.style === 'highlight' || tier.isPopular;
                    const isOutline = tier.style === 'outline';

                    return (
                        <div
                            key={index}
                            className={clsx(
                                "p-10 rounded-3xl bg-white relative transition-all duration-300 md:min-h-[500px] flex flex-col",
                                isHighlight
                                    ? "border-2 border-red-600 scale-105 shadow-xl z-10"
                                    : "border border-black/10 hover:border-red-600 group hover:shadow-lg"
                            )}
                        >
                            {tier.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <p className="text-xs uppercase tracking-widest text-black/40 mb-2 font-bold">{tier.name}</p>
                            <div className="mb-8">
                                <span className="text-5xl font-medium">{tier.price}</span>
                                {tier.priceSuffix && <span className="text-sm font-normal text-black/40">{tier.priceSuffix}</span>}
                            </div>

                            <ul className="text-left space-y-4 mb-10 text-black/60 flex-grow">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="mr-2 text-brand">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={clsx(
                                    "w-full py-4 rounded-full transition-all font-medium mt-auto",
                                    isHighlight
                                        ? "bg-brand text-white hover:bg-black"
                                        : "border border-black/10 group-hover:bg-black group-hover:text-white"
                                )}
                            >
                                {tier.ctaLabel}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
