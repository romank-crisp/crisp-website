"use client";

import { PricingTableProps } from "@/types/case-study";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CaseStudyPricingTable({ title, tiers }: PricingTableProps) {
    return (
        <div id="pricing" className="max-w-[1475px] mx-auto py-24 md:py-32 text-center">
            {title && <h2 className="text-4xl md:text-6xl font-medium mb-16 px-16 md:px-0">{title}</h2>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => {
                    const isHighlight = tier.style === 'highlight' || tier.isPopular;

                    return (
                        <div
                            key={index}
                            className={clsx(
                                "p-10 rounded-3xl bg-white relative transition-all duration-300 md:min-h-[500px] flex flex-col",
                                isHighlight
                                    ? "border-2 border-brand scale-105 shadow-xl z-10"
                                    : "border border-black/10 hover:border-brand group hover:shadow-lg"
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

                            <ul className="text-left space-y-4 mb-10 text-black/60 flex-grow text-sm">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="mr-2 text-brand">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={isHighlight ? "filled" : "outline"}
                                size="medium"
                                className="w-full"
                                rightIcon={ArrowRight}
                            >
                                {tier.ctaLabel}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
