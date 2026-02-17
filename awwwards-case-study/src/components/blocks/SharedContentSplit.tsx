"use client";

import { ContentSplitProps } from "@/types/case-study";
import { SharedScrollRevealImage } from "./SharedScrollRevealImage";
import { clsx } from "clsx";

export const SharedContentSplit = ({ heading, text, image, reverse }: ContentSplitProps) => {
    return (
        <div className="max-w-[1475px] mx-auto py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-16 md:px-64">
            <div className={clsx("space-y-8", reverse && "md:order-2")}>
                <h2 className="text-4xl md:text-6xl font-medium leading-tight">{heading}</h2>
                <div className="space-y-4 font-text text-xl text-black/60">
                    {Array.isArray(text) ? (
                        text.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    )}
                </div>
            </div>
            <div className={clsx("relative w-full h-[600px] overflow-hidden", reverse ? "md:order-1" : "md:order-2")}>
                <SharedScrollRevealImage
                    src={image.src}
                    alt={image.alt || heading}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
