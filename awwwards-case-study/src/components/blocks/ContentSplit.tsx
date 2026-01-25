"use client";

import { ContentSplitProps } from "@/types/case-study";
import { ScrollRevealImage } from "./ScrollRevealImage";
import { clsx } from "clsx";

export function ContentSplit({ heading, text, image, reverse }: ContentSplitProps) {
    return (
        <div className="container mx-auto px-4 md:px-8 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={clsx("space-y-8", reverse && "md:order-2")}>
                <h2 className="text-4xl md:text-6xl font-medium leading-tight">{heading}</h2>
                <div className="space-y-4 font-text text-xl text-black/60">
                    {text}
                </div>
            </div>
            <div className={clsx("relative aspect-square bg-[#F5F5F5] rounded-3xl overflow-hidden", reverse && "md:order-1")}>
                <ScrollRevealImage
                    src={image.src}
                    alt={image.alt}
                    aspectRatio="aspect-square"
                    className="h-full"
                />
            </div>
        </div>
    );
}
