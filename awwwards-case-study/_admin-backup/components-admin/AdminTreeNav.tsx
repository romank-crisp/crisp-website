"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

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

/* ─── Main component ────────────────────────────────────────────── */

export function AdminTreeNav({ groups, activeId, onSelect }: AdminTreeNavProps) {
    // Auto-expand accordion items whose children contain the active item
    const expandedValues = useMemo(() => {
        const values: string[] = [];
        groups.forEach((group) => {
            group.items.forEach((item) => {
                if (isBranch(item) && item.children.some((c) => c.id === activeId)) {
                    values.push(item.id);
                }
            });
        });
        return values;
    }, [groups, activeId]);

    return (
        <div className="w-[260px] min-w-[260px] bg-[#fafafa] flex flex-col h-full overflow-hidden border-r border-gray-200">
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {groups.map((group, gi) => (
                    <div key={group.title || `g-${gi}`} className="mb-5 last:mb-0">
                        {group.title && (
                            <h3 className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                {group.title}
                            </h3>
                        )}

                        <Accordion.Root
                            type="multiple"
                            defaultValue={expandedValues}
                            className="space-y-0.5"
                        >
                            {group.items.map((item) => {
                                if (isBranch(item)) {
                                    const isChildActive = item.children.some(
                                        (c) => c.id === activeId
                                    );

                                    return (
                                        <Accordion.Item
                                            key={item.id}
                                            value={item.id}
                                            className="rounded-lg overflow-hidden"
                                        >
                                            <Accordion.Trigger
                                                className={clsx(
                                                    "w-full flex items-center justify-between gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors group",
                                                    "hover:bg-black/5 cursor-pointer",
                                                    "[&[data-state=open]>svg]:rotate-90",
                                                    isChildActive
                                                        ? "text-black font-semibold"
                                                        : "text-gray-600"
                                                )}
                                            >
                                                <span className="truncate">{item.label}</span>
                                                <ChevronRight
                                                    size={14}
                                                    className="shrink-0 text-gray-400 transition-transform duration-200"
                                                />
                                            </Accordion.Trigger>

                                            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                                <div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5 py-1">
                                                    {item.children.map((child) => {
                                                        const isActive = activeId === child.id;
                                                        return (
                                                            <button
                                                                key={child.id}
                                                                onClick={() => onSelect(child.id)}
                                                                className={clsx(
                                                                    "w-full text-left px-3 py-1.5 text-[13px] rounded-md transition-colors truncate",
                                                                    isActive
                                                                        ? "bg-black text-white font-medium"
                                                                        : "text-gray-500 hover:bg-black/5 hover:text-black"
                                                                )}
                                                            >
                                                                {child.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </Accordion.Content>
                                        </Accordion.Item>
                                    );
                                }

                                // Standalone leaf item
                                const isActive = activeId === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onSelect(item.id)}
                                        className={clsx(
                                            "w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors",
                                            isActive
                                                ? "bg-black text-white"
                                                : "text-gray-600 hover:bg-black/5 hover:text-black"
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </Accordion.Root>
                    </div>
                ))}
            </nav>
        </div>
    );
}
