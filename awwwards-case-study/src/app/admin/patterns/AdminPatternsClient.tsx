"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { TreeGroup } from "@/components/admin/AdminTreeNav";
import Link from "next/link";
import { Layers, Plus, ArrowUp, ArrowDown, Trash2, Check, Copy, ChevronLeft, ChevronRight, Eye, X, Tag } from "lucide-react";
import { BlockEntry } from "@/app/pattern-library/pattern-library-page";
import { updateContent } from "@/app/actions/content";

const SCALE = 0.25;
const IFRAME_WIDTH = 1440;

const TAG_ORDER = ["Header", "Text", "Forms", "Gallery", "Image", "Numbers", "Sections", "Custom"];

function buildPatternsTree(blocks: BlockEntry[]): TreeGroup[] {
    const allTags = Array.from(new Set(blocks.flatMap((b) => b.tags)));
    const hasUndefined = blocks.some((b) => b.tags.length === 0);

    // Sort: known order first, then any new tags alphabetically at the end
    const sorted = [
        ...TAG_ORDER.filter((t) => allTags.includes(t)),
        ...allTags.filter((t) => !TAG_ORDER.includes(t)).sort(),
    ];

    return [
        {
            title: "Pattern Tags",
            items: [
                ...sorted.map((tag) => ({
                    id: `tag-${tag}`,
                    label: tag,
                    icon: Tag,
                })),
                ...(hasUndefined ? [{ id: "tag-undefined", label: "Undefined", icon: Tag }] : []),
            ],
        },
    ];
}

interface BuilderBlock {
    id: string;
    entry: BlockEntry;
}

import { useEffect } from "react";

export default function AdminPatternsClient({ blocks: initialBlocks }: { blocks: BlockEntry[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [blocks, setBlocks] = useState<BlockEntry[]>(initialBlocks);
    const initialTag = searchParams.get("tag") || "";
    const [activeId, setActiveId] = useState(initialTag ? `tag-${initialTag}` : "");
    const [builderBlocks, setBuilderBlocks] = useState<BuilderBlock[]>([]);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(true);
    const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const PATTERNS_TREE = useMemo(() => buildPatternsTree(blocks), [blocks]);

    // Sync URL when activeId changes
    const updateUrl = useCallback((id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const tagName = id.replace("tag-", "");
        params.set("tag", tagName);
        window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }, [searchParams, pathname]);

    // Scroll to initial tag on mount
    useEffect(() => {
        if (initialTag) {
            const targetId = `tag-${initialTag}`;
            const element = document.getElementById(`pattern-section-${targetId}`);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 300);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Setup scrolling observer to sync navigation tree with viewport
    useEffect(() => {
        // Only observe actual tag sections
        const sectionIds = PATTERNS_TREE[0].items.map(i => i.id);

        const observer = new IntersectionObserver(
            (entries) => {
                let foundIntersecting = false;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id.replace("pattern-section-", "");
                        setActiveId(id);
                        updateUrl(id);
                        foundIntersecting = true;
                    }
                });
            },
            {
                root: null,
                rootMargin: "-10% 0px -80% 0px",
            }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(`pattern-section-${id}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [PATTERNS_TREE]);

    const handleTreeSelect = (id: string) => {
        setActiveId(id);
        updateUrl(id);
        const element = document.getElementById(`pattern-section-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    /* ─── Tag CRUD ──────────────────────────────────────────────────── */

    const persistBlocks = useCallback(async (updatedBlocks: BlockEntry[]) => {
        setSaving(true);
        try {
            await updateContent("patterns.json", updatedBlocks);
        } catch (e) {
            console.error("Failed to save patterns:", e);
        } finally {
            setSaving(false);
        }
    }, []);

    const handleAddTag = useCallback((blockName: string, newTag: string) => {
        const tag = newTag.trim();
        if (!tag) return;

        setBlocks((prev) => {
            const updated = prev.map((b) =>
                b.name === blockName && !b.tags.includes(tag)
                    ? { ...b, tags: [...b.tags, tag] }
                    : b
            );
            persistBlocks(updated);
            return updated;
        });

        setNewTagInputs((prev) => ({ ...prev, [blockName]: "" }));
    }, [persistBlocks]);

    const handleRemoveTag = useCallback((blockName: string, tagToRemove: string) => {
        setBlocks((prev) => {
            const updated = prev.map((b) =>
                b.name === blockName
                    ? { ...b, tags: b.tags.filter((t) => t !== tagToRemove) }
                    : b
            );
            persistBlocks(updated);
            return updated;
        });
    }, [persistBlocks]);

    const handleRenameLabel = useCallback((blockName: string, newLabel: string) => {
        const label = newLabel.trim();
        if (!label) return;
        setBlocks((prev) => {
            const updated = prev.map((b) =>
                b.name === blockName ? { ...b, label } : b
            );
            persistBlocks(updated);
            return updated;
        });
    }, [persistBlocks]);

    /* ─── Builder handlers ──────────────────────────────────────────── */

    const handleAdd = (entry: BlockEntry) => {
        setBuilderBlocks((prev) => [
            ...prev,
            { id: Math.random().toString(36).slice(2, 9), entry },
        ]);
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        setBuilderBlocks((prev) => {
            const next = [...prev];
            if (direction === "up" && index > 0) {
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
            } else if (direction === "down" && index < next.length - 1) {
                [next[index + 1], next[index]] = [next[index], next[index + 1]];
            }
            return next;
        });
    };

    const handleRemove = (id: string) => {
        setBuilderBlocks((prev) => prev.filter((b) => b.id !== id));
    };

    const handleCopyPrompt = () => {
        if (builderBlocks.length === 0) return;
        const blockList = builderBlocks.map((b, i) => `${i + 1}. ${b.entry.name}`).join("\n");
        const snippet = `Please create a new static page using the following blocks in this exact order:\n\n${blockList}\n\nPlease assemble them using standard layout practices.`;
        navigator.clipboard.writeText(snippet);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    };

    // Calculate grouped blocks based on tree so we can render them sequentially
    const groupedSections = useMemo(() => {
        const sections: { id: string; title: string | null; blocks: BlockEntry[] }[] = [];

        // Loop through all tags and push them as standalone sections
        PATTERNS_TREE[0].items.forEach(item => {
            let filteredBlocks: BlockEntry[] = [];
            if (item.id === "tag-undefined") {
                filteredBlocks = blocks.filter((b) => b.tags.length === 0);
            } else {
                const tagMatch = item.id.match(/^tag-(.+)$/);
                if (tagMatch) {
                    filteredBlocks = blocks.filter((b) => b.tags.includes(tagMatch[1]));
                }
            }

            if (filteredBlocks.length > 0) {
                sections.push({
                    id: item.id,
                    title: item.label,
                    blocks: filteredBlocks
                });
            }
        });

        return sections;
    }, [blocks, PATTERNS_TREE]);

    return (
        <AdminLayout
            treeGroups={PATTERNS_TREE}
            activeTreeId={activeId}
            onTreeSelect={handleTreeSelect}
            contentHeader="Pattern Library"
            contentSubheader={`Every UI block at a glance${saving ? " — Saving…" : ""}`}
            rightPanel={
                <>
                    {/* Right side: Page Builder Panel (Toggled) */}
                    <div
                        className={`shrink-0 transition-all duration-300 ease-in-out bg-white z-10 ${isBuilderOpen ? "w-[320px] xl:w-[380px] opacity-100" : "w-0 opacity-0 overflow-hidden"
                            }`}
                    >
                        <aside className="w-[320px] xl:w-[380px] h-full flex flex-col bg-[#f5f5f5] border-l border-gray-200">
                            {/* Panel Header */}
                            <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-black mb-1">Page Builder</h2>
                                    <p className="font-text text-sm text-gray-500">
                                        {builderBlocks.length} block{builderBlocks.length !== 1 ? "s" : ""} added
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsBuilderOpen(false)}
                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Builder Blocks Array */}
                            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                                {builderBlocks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-40">
                                        <Layers size={48} className="mb-4" strokeWidth={1} />
                                        <p className="font-text text-sm">
                                            Click <strong>+ Add</strong> on any block to queue it here.
                                        </p>
                                    </div>
                                ) : (
                                    builderBlocks.map((block, index) => {
                                        const BUILDER_SCALE = 0.22;
                                        const builderScaledHeight = block.entry.previewHeight * BUILDER_SCALE;

                                        return (
                                            <div
                                                key={block.id}
                                                className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-sm group hover:border-brand/30 transition-colors overflow-hidden"
                                            >
                                                {/* Action Header */}
                                                <div className="p-3 border-b border-gray-200 bg-[#fafafa] flex items-center justify-between gap-3">
                                                    <div className="font-mono text-[10px] font-bold text-gray-400 w-5 h-5 flex items-center justify-center bg-gray-200/50 rounded-full">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-heading text-xs font-bold truncate">
                                                            {block.entry.label}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="flex flex-col">
                                                            <button
                                                                onClick={() => handleMove(index, "up")}
                                                                disabled={index === 0}
                                                                className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400"
                                                            >
                                                                <ArrowUp size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleMove(index, "down")}
                                                                disabled={index === builderBlocks.length - 1}
                                                                className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:hover:text-gray-400"
                                                            >
                                                                <ArrowDown size={12} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemove(block.id)}
                                                            className="p-2 ml-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Visual Iframe Preview */}
                                                <div
                                                    className="relative overflow-hidden w-full bg-white"
                                                    style={{ height: builderScaledHeight }}
                                                >
                                                    <iframe
                                                        src={`/pattern-library/preview/${block.entry.name}`}
                                                        title={block.entry.label}
                                                        loading="lazy"
                                                        tabIndex={-1}
                                                        style={{
                                                            width: IFRAME_WIDTH,
                                                            height: block.entry.previewHeight,
                                                            transform: `scale(${BUILDER_SCALE})`,
                                                            transformOrigin: "top left",
                                                            pointerEvents: "none",
                                                            border: "none",
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer / Actions */}
                            <div className="p-4 border-t border-gray-200 bg-white z-10 w-full mt-auto flex flex-col gap-3">
                                <Link
                                    href={`/admin/patterns/preview?blocks=${builderBlocks.map(b => b.entry.name).join(',')}`}
                                    target="_blank"
                                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300 ${builderBlocks.length === 0
                                        ? "bg-gray-100 text-gray-400 pointer-events-none"
                                        : "bg-white text-brand border-2 border-brand hover:bg-brand/5 shadow-sm"
                                        }`}
                                >
                                    <Eye size={18} />
                                    Preview Page
                                </Link>

                                <button
                                    onClick={handleCopyPrompt}
                                    disabled={builderBlocks.length === 0}
                                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300 ${builderBlocks.length === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed hidden"
                                        : copiedPrompt
                                            ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                                            : "bg-black text-white hover:bg-black/80 shadow-md"
                                        }`}
                                >
                                    {copiedPrompt ? <Check size={18} /> : <Copy size={18} />}
                                    {copiedPrompt ? "Prompt Copied" : "Copy LLM Prompt"}
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Floating Open Toggle (visible when panel is closed) */}
                    {!isBuilderOpen && (
                        <button
                            onClick={() => setIsBuilderOpen(true)}
                            className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 border-r-0 rounded-l-xl p-3 shadow-lg text-gray-500 hover:text-black transition-colors z-50 flex flex-col items-center gap-2"
                            title="Open Page Builder"
                        >
                            <ChevronLeft size={24} />
                            <span className="[writing-mode:vertical-lr] font-heading font-bold tracking-widest uppercase text-xs rotate-180">
                                Builder
                            </span>
                        </button>
                    )}
                </>
            }
        >
            <div className="space-y-48 pb-32">
                {groupedSections.map((section) => (
                    <section
                        key={section.id}
                        id={`pattern-section-${section.id}`}
                        className="scroll-mt-16"
                    >
                        {section.title && (
                            <div className="mb-8 border-b border-gray-200 pb-4">
                                <h2 className="font-heading text-2xl text-black">
                                    {section.title}
                                </h2>
                            </div>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
                            {section.blocks.map((block) => {
                                const scaledHeight = block.previewHeight * SCALE;

                                return (
                                    <div
                                        key={block.name}
                                        className="group relative h-full flex flex-col bg-[#fafafa] border border-gray-200 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lg transition-all duration-300 text-left"
                                    >
                                        {/* Iframe viewport - clicking opens preview in new tab */}
                                        <Link
                                            href={`/pattern-library/preview/${block.name}`}
                                            target="_blank"
                                            className="relative overflow-hidden w-full block cursor-pointer group-hover:opacity-95 transition-opacity"
                                            style={{ height: scaledHeight }}
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

                                        {/* Label + Tags bar */}
                                        <div className="mt-auto border-t border-gray-200 w-full">
                                            {/* Top: label + add button */}
                                            <div className="px-6 pt-3 pb-1 flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p
                                                        className="font-heading text-sm font-bold truncate outline-none hover:bg-black/5 focus:bg-black/5 rounded px-1 -mx-1 transition-colors"
                                                        contentEditable
                                                        suppressContentEditableWarning
                                                        onBlur={(e) => handleRenameLabel(block.name, e.currentTarget.textContent || block.label)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                (e.target as HTMLElement).blur();
                                                            }
                                                        }}
                                                    >
                                                        {block.label}
                                                    </p>
                                                    <p className="font-text text-[11px] opacity-40 truncate">
                                                        {block.name}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleAdd(block)}
                                                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 bg-gray-100 text-gray-500 hover:bg-brand hover:text-white"
                                                >
                                                    <Plus size={14} strokeWidth={2.5} />
                                                    Add
                                                </button>
                                            </div>

                                            {/* Tags row */}
                                            <div className="px-6 pb-3 pt-1 flex items-center gap-1.5 flex-wrap">
                                                {block.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center gap-1 bg-black/5 text-gray-600 text-[11px] font-medium pl-2 pr-1.5 py-0.5 rounded-full group/tag hover:bg-red-50 hover:text-red-500 hover:pr-1 transition-all"
                                                    >
                                                        {tag}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveTag(block.name, tag);
                                                            }}
                                                            className="opacity-40 group-hover/tag:opacity-100 hover:text-red-600 transition-opacity"
                                                            title={`Remove tag "${tag}"`}
                                                        >
                                                            <X size={10} strokeWidth={3} />
                                                        </button>
                                                    </span>
                                                ))}

                                                {/* Inline add-tag input */}
                                                <input
                                                    type="text"
                                                    placeholder="+ tag"
                                                    value={newTagInputs[block.name] || ""}
                                                    onChange={(e) =>
                                                        setNewTagInputs((prev) => ({
                                                            ...prev,
                                                            [block.name]: e.target.value,
                                                        }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleAddTag(block.name, newTagInputs[block.name] || "");
                                                        }
                                                    }}
                                                    className="bg-transparent border-none outline-none text-[11px] text-gray-400 placeholder:text-gray-300 w-[50px] focus:w-[80px] transition-all focus:text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </AdminLayout>
    );
}
