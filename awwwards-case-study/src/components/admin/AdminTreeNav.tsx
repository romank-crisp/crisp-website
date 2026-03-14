"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Plus, Minus } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */

export interface TreeLeaf {
    id: string;
    label: string;
}

export interface TreeBranch {
    id: string;
    label: string;
    icon?: any;
    children: TreeLeaf[];
}

export interface TreeGroup {
    title?: string;
    items: (TreeBranch | (TreeLeaf & { icon?: any }))[];
}

export interface AdminTreeNavProps {
    groups: TreeGroup[];
    activeId: string;
    onSelect: (id: string) => void;
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function isBranch(item: any): item is TreeBranch {
    return Array.isArray(item.children);
}

/* ─── Expandable group ──────────────────────────────────────────── */

function TreeBranchItem({
    item,
    activeId,
    onSelect,
}: {
    item: TreeBranch;
    activeId: string;
    onSelect: (id: string) => void;
}) {
    const isChildActive = item.children.some((c) => c.id === activeId);
    const [isExpanded, setIsExpanded] = useState(isChildActive);

    // Auto-expand if a child becomes active externally
    useEffect(() => {
        if (isChildActive) setIsExpanded(true);
    }, [isChildActive]);

    return (
        <div className="border-b border-gray-200/60 last:border-0 py-2">
            {/* Parent label */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={clsx(
                    "w-full flex items-center justify-between gap-3 px-4 py-2 text-lg transition-colors group",
                    isChildActive
                        ? "text-black font-semibold"
                        : "text-gray-700 hover:text-black hover:font-medium"
                )}
            >
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 group-hover:text-black transition-colors">
                        {isExpanded ? <Minus size={20} strokeWidth={2} /> : <Plus size={20} strokeWidth={2} />}
                    </span>
                    <span>{item.label}</span>
                </div>
            </button>

            {/* Children */}
            {isExpanded && (
                <div className="ml-[44px] space-y-1 mt-1 mb-2">
                    {item.children.map((child) => {
                        const isActive = activeId === child.id;
                        return (
                            <button
                                key={child.id}
                                onClick={() => onSelect(child.id)}
                                className={clsx(
                                    "w-full text-left py-1.5 text-[15px] transition-colors",
                                    isActive
                                        ? "text-brand font-medium"
                                        : "text-gray-500 hover:text-black hover:font-medium"
                                )}
                            >
                                {child.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─── Clickable branch (auto-expand on click) ───────────────────── */

function ClickableBranchItem({
    item,
    activeId,
    onSelect,
}: {
    item: TreeBranch;
    activeId: string;
    onSelect: (id: string) => void;
}) {
    const isChildActive = item.children.some((c) => c.id === activeId);
    const [isExpanded, setIsExpanded] = useState(isChildActive);

    // Auto-expand if a child becomes active externally
    useEffect(() => {
        if (isChildActive) setIsExpanded(true);
    }, [isChildActive]);

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleParentClick = () => {
        // Expand if it isn't already
        if (!isExpanded) {
            setIsExpanded(true);
        }

        // Select first child to load immediately
        if (item.children.length > 0 && !isChildActive) {
            onSelect(item.children[0].id);
        } else if (isChildActive) {
            // If already active, just collapse
            setIsExpanded(false);
        }
    };

    return (
        <div className="border-b border-gray-200/60 last:border-0 py-2">
            {/* Parent label — clickable */}
            <div className={clsx(
                "w-full flex items-center gap-3 px-4 py-2 hover:bg-black/5 rounded-md transition-colors cursor-pointer group",
                isChildActive ? "text-black" : "text-gray-700 hover:text-black"
            )} onClick={handleParentClick}>
                <button
                    onClick={handleIconClick}
                    className="p-1 -ml-1 flex items-center justify-center rounded-sm hover:bg-black/10 transition-colors text-gray-400 group-hover:text-black"
                >
                    {isExpanded ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
                </button>
                <span className={clsx("text-lg", isChildActive ? "font-semibold" : "font-medium group-hover:font-semibold")}>
                    {item.label}
                </span>
            </div>

            {/* Children */}
            {isExpanded && (
                <div className="ml-[40px] space-y-1 mt-1 mb-2">
                    {item.children.map((child) => {
                        const isActive = activeId === child.id;
                        return (
                            <button
                                key={child.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(child.id);
                                }}
                                className={clsx(
                                    "w-full text-left py-1.5 px-2 rounded-md transition-colors text-[15px]",
                                    isActive
                                        ? "bg-black/5 text-black font-semibold"
                                        : "text-gray-500 hover:bg-black/5 hover:text-black font-medium"
                                )}
                            >
                                {child.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─── Main component ────────────────────────────────────────────── */

export function AdminTreeNav({ groups, activeId, onSelect }: AdminTreeNavProps) {
    return (
        <div className="w-[260px] min-w-[260px] bg-[#f5f5f5] flex flex-col h-full overflow-hidden">
            <nav className="flex-1 overflow-y-auto py-6 px-2">
                {groups.map((group, gi) => (
                    <div key={group.title || `g-${gi}`} className="mb-6 last:mb-0">
                        {group.title && (
                            <h3 className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                {group.title}
                            </h3>
                        )}
                        <div className="border-t border-gray-200/60 mt-4">
                            {group.items.map((item) => {
                                if (isBranch(item)) {
                                    return (
                                        <ClickableBranchItem
                                            key={item.id}
                                            item={item}
                                            activeId={activeId}
                                            onSelect={onSelect}
                                        />
                                    );
                                }

                                const isActive = activeId === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onSelect(item.id)}
                                        className={clsx(
                                            "w-full flex items-center gap-3 px-4 py-2.5 text-lg transition-colors border-b border-gray-200/60 last:border-0",
                                            isActive
                                                ? "text-black font-semibold"
                                                : "text-gray-700 hover:text-black hover:font-medium"
                                        )}
                                    >
                                        <Plus size={24} className="opacity-0" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
}
