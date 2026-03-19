"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs } from "@/components/ui/Tabs";

/* ─── Block catalogue ───────────────────────────────────────────── */

export interface BlockEntry {
    name: string;       // Component name (also the preview route param)
    label: string;      // Human-readable label
    tags: string[];     // Semantic tags for filtering
    previewHeight: number; // px – full-size height the iframe should have
}

const SCALE = 0.25;
const IFRAME_WIDTH = 1440; // full-size viewport width

/* ─── Component ─────────────────────────────────────────────────── */

export default function PatternLibraryPage({ blocks }: { blocks: BlockEntry[] }) {
    const [activeTag, setActiveTag] = useState("All");
    const [copiedName, setCopiedName] = useState<string | null>(null);

    const allTags = useMemo(() => {
        return ["All", ...Array.from(new Set(blocks.flatMap(b => b.tags))).sort()];
    }, [blocks]);

    const tabs = allTags.map(c => ({ label: c, value: c }));

    const filteredBlocks = useMemo(() => {
        if (activeTag === "All") return blocks;
        return blocks.filter(b => b.tags.includes(activeTag));
    }, [activeTag, blocks]);

    const handleCopy = (name: string) => {
        const snippet = `import { ${name} } from "@/components/blocks/${name}";`;
        navigator.clipboard.writeText(snippet);
        setCopiedName(name);
        setTimeout(() => setCopiedName(null), 2000);
    };

    return (
        <main className="min-h-screen bg-white text-text p-32 md:p-64 pt-[15vh]">
            {/* Header */}
            <div className="flex flex-col gap-32 mb-64 border-b border-text/10 pb-32">
                <div>
                    <h1 className="font-heading text-h1 uppercase mb-8 text-brand">
                        Pattern<br />Library
                    </h1>
                    <p className="font-text text-xl md:text-2xl opacity-60 max-w-2xl">
                        Every UI block at a glance — click to copy the import statement.
                    </p>
                </div>

                <div className="flex flex-col gap-16">
                    <Tabs
                        items={tabs}
                        activeValue={activeTag}
                        onChange={setActiveTag}
                        className="w-fit"
                    />
                </div>
            </div>

            {/* Grid of block preview cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-32">
                {filteredBlocks.map((block) => {
                    const scaledHeight = block.previewHeight * SCALE;

                    return (
                        <div
                            key={block.name}
                            className="group relative h-full flex flex-col bg-[#fafafa] border border-text/5 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lg transition-all duration-300 text-left"
                        >
                            {/* Iframe viewport - clicking opens preview in new tab */}
                            <Link
                                href={`/pattern-library/preview/${block.name}`}
                                target="_blank"
                                className="relative overflow-hidden w-full block cursor-pointer group-hover:opacity-95 transition-opacity"
                                style={{
                                    height: scaledHeight,
                                }}
                            >
                                <iframe
                                    src={`/pattern-library/preview/${block.name}`}
                                    title={block.label}
                                    loading="lazy"
                                    tabIndex={-1}
                                    style={{
                                        width: IFRAME_WIDTH,
                                        height: block.previewHeight,
                                        transform: `scale(${SCALE})`,
                                        transformOrigin: "top left",
                                        pointerEvents: "none",
                                        border: "none",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            </Link>

                            {/* Label bar - clicking copies the import statement */}
                            <button
                                onClick={() => handleCopy(block.name)}
                                className="mt-auto px-32 py-12 border-t border-text/5 flex items-center justify-between gap-8 w-full cursor-pointer hover:bg-gray-50 text-left transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="font-heading text-sm font-bold truncate">
                                        {block.label}
                                    </p>
                                    <p className="font-text text-xs opacity-40 truncate">
                                        {block.tags.join(', ')} · {block.name}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 ${copiedName === block.name
                                        ? "bg-green-100 text-green-700"
                                        : "bg-text/5 text-text/40 group-hover:bg-brand/10 group-hover:text-brand"
                                        }`}
                                >
                                    {copiedName === block.name ? "Copied!" : "Copy"}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}
