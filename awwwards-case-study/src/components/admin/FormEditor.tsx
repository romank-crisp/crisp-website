"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

/* ─── helpers ──────────────────────────────────────────────────────── */

function isGcsUrl(value: unknown): value is string {
    return typeof value === "string" && value.includes("storage.googleapis.com");
}

function isImageUrl(value: unknown): value is string {
    if (typeof value !== "string") return false;
    return /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(value) || isGcsUrl(value);
}

function isVideoUrl(value: unknown): value is string {
    if (typeof value !== "string") return false;
    return /\.(mp4|webm|mov)(\?|$)/i.test(value);
}

function isLongString(value: string): boolean {
    return value.length > 80 || value.includes("\n");
}

function humanLabel(key: string): string {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())
        .trim();
}

/* ─── sub-components ───────────────────────────────────────────────── */

function FieldLabel({ label, htmlFor }: { label: string; htmlFor?: string }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block font-text text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
        >
            {label}
        </label>
    );
}

/* ─── Media preview ────────────────────────────────────────────────── */

function MediaPreview({ url }: { url: string }) {
    if (isVideoUrl(url)) {
        return (
            <video
                src={url}
                className="w-full max-h-[160px] object-contain rounded-lg border border-gray-200 bg-gray-50 mt-2"
                muted
                loop
                autoPlay
                playsInline
            />
        );
    }
    if (isImageUrl(url)) {
        return (
            <img
                src={url}
                alt=""
                className="w-full max-h-[160px] object-contain rounded-lg border border-gray-200 bg-gray-50 mt-2"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
        );
    }
    return null;
}

/* ─── Array item ───────────────────────────────────────────────────── */

function ArrayItem({
    index,
    value,
    onChange,
    onRemove,
    parentPath,
}: {
    index: number;
    value: any;
    onChange: (v: any) => void;
    onRemove: () => void;
    parentPath: string;
}) {
    const [open, setOpen] = useState(false);
    const isObject = typeof value === "object" && value !== null && !Array.isArray(value);

    // Non-object primitives are always expanded
    if (!isObject) {
        return (
            <div className="group relative border border-gray-200 rounded-xl bg-white mb-2 transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                    <span className="font-text text-xs font-medium text-gray-400">
                        #{index + 1}
                    </span>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1 rounded-md hover:bg-red-50"
                        title="Remove item"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
                <div className="p-4">
                    <PrimitiveField
                        fieldKey={`item-${index}`}
                        value={value}
                        onChange={onChange}
                        path={`${parentPath}[${index}]`}
                    />
                </div>
            </div>
        );
    }

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <div className="group relative border border-gray-200 rounded-xl bg-white mb-2 transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                    <Collapsible.Trigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="font-text text-xs font-medium">
                                #{index + 1}
                                {(value.label || value.title || value.name || value.id)
                                    ? ` — ${value.label || value.title || value.name || value.id}`
                                    : ""}
                            </span>
                        </button>
                    </Collapsible.Trigger>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1 rounded-md hover:bg-red-50"
                        title="Remove item"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="p-4">
                        <ObjectFields
                            data={value}
                            onChange={onChange}
                            path={`${parentPath}[${index}]`}
                        />
                    </div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    );
}

/* ─── Primitive field renderer ─────────────────────────────────────── */

function PrimitiveField({
    fieldKey,
    value,
    onChange,
    path,
}: {
    fieldKey: string;
    value: any;
    onChange: (v: any) => void;
    path: string;
}) {
    const id = `field-${path}`;

    if (typeof value === "boolean") {
        return (
            <label className="inline-flex items-center gap-3 cursor-pointer select-none py-1" htmlFor={id}>
                <div className="relative">
                    <input
                        id={id}
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-checked:bg-black rounded-full transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="font-text text-sm text-gray-700">{value ? "Yes" : "No"}</span>
            </label>
        );
    }

    if (typeof value === "number") {
        return (
            <input
                id={id}
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="font-text w-full px-[8px] py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
            />
        );
    }

    if (typeof value === "string") {
        const showMedia = isImageUrl(value) || isVideoUrl(value);

        if (isLongString(value)) {
            return (
                <div>
                    <textarea
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={Math.min(8, Math.max(3, value.split("\n").length + 1))}
                        className="font-text w-full px-[8px] py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 resize-y transition-all"
                    />
                    {showMedia && <MediaPreview url={value} />}
                </div>
            );
        }

        return (
            <div>
                <div className="relative">
                    {showMedia && (
                        <ImageIcon
                            size={14}
                            className="absolute left-[10px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                        />
                    )}
                    <input
                        id={id}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`font-text w-full py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all
                                    ${showMedia ? "pl-[32px] pr-[8px]" : "px-[8px]"}`}
                    />
                </div>
                {showMedia && <MediaPreview url={value} />}
            </div>
        );
    }

    // Fallback: render as JSON string
    return (
        <input
            id={id}
            type="text"
            value={JSON.stringify(value)}
            onChange={(e) => {
                try {
                    onChange(JSON.parse(e.target.value));
                } catch {
                    onChange(e.target.value);
                }
            }}
            className="font-text w-full px-[8px] py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
        />
    );
}

/* ─── Object fields ────────────────────────────────────────────────── */

function ObjectFields({
    data,
    onChange,
    path,
}: {
    data: Record<string, any>;
    onChange: (newData: Record<string, any>) => void;
    path: string;
}) {
    const handleFieldChange = (key: string, value: any) => {
        onChange({ ...data, [key]: value });
    };

    return (
        <div className="space-y-5">
            {Object.entries(data).map(([key, value]) => {
                const fieldPath = `${path}.${key}`;

                // Nested object
                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    return (
                        <CollapsibleSection key={key} label={humanLabel(key)} defaultOpen={false}>
                            <ObjectFields
                                data={value}
                                onChange={(newVal) => handleFieldChange(key, newVal)}
                                path={fieldPath}
                            />
                        </CollapsibleSection>
                    );
                }

                // Array
                if (Array.isArray(value)) {
                    return (
                        <ArrayField
                            key={key}
                            fieldKey={key}
                            value={value}
                            onChange={(newVal) => handleFieldChange(key, newVal)}
                            path={fieldPath}
                        />
                    );
                }

                // Primitive
                return (
                    <div key={key}>
                        <FieldLabel label={humanLabel(key)} htmlFor={`field-${fieldPath}`} />
                        <PrimitiveField
                            fieldKey={key}
                            value={value}
                            onChange={(newVal) => handleFieldChange(key, newVal)}
                            path={fieldPath}
                        />
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Array field ──────────────────────────────────────────────────── */

function ArrayField({
    fieldKey,
    value,
    onChange,
    path,
}: {
    fieldKey: string;
    value: any[];
    onChange: (v: any[]) => void;
    path: string;
}) {
    const handleItemChange = (index: number, newValue: any) => {
        const updated = [...value];
        updated[index] = newValue;
        onChange(updated);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        if (value.length === 0) {
            onChange([...value, ""]);
            return;
        }
        const template = value[value.length - 1];
        if (typeof template === "object" && template !== null) {
            const blank = JSON.parse(JSON.stringify(template));
            const clearValues = (obj: any) => {
                for (const k of Object.keys(obj)) {
                    if (typeof obj[k] === "string") obj[k] = "";
                    else if (typeof obj[k] === "number") obj[k] = 0;
                    else if (typeof obj[k] === "boolean") obj[k] = false;
                    else if (Array.isArray(obj[k])) obj[k] = [];
                    else if (typeof obj[k] === "object" && obj[k] !== null) clearValues(obj[k]);
                }
            };
            clearValues(blank);
            onChange([...value, blank]);
        } else {
            onChange([...value, typeof template === "number" ? 0 : ""]);
        }
    };

    return (
        <CollapsibleSection
            label={`${humanLabel(fieldKey)} (${value.length})`}
            defaultOpen={false}
        >
            <div className="space-y-2">
                {value.map((item, i) => (
                    <ArrayItem
                        key={i}
                        index={i}
                        value={item}
                        onChange={(v) => handleItemChange(i, v)}
                        onRemove={() => handleRemove(i)}
                        parentPath={path}
                    />
                ))}
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-500 hover:text-black
                               border border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all
                               hover:bg-gray-50 w-full justify-center"
                >
                    <Plus size={13} /> Add item
                </button>
            </div>
        </CollapsibleSection>
    );
}

/* ─── Collapsible section (Radix) ──────────────────────────────────── */

function CollapsibleSection({
    label,
    defaultOpen = false,
    children,
}: {
    label: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <Collapsible.Trigger asChild>
                    <button
                        type="button"
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50/80 hover:bg-gray-100/80
                                   font-text text-sm font-semibold text-gray-700 transition-colors text-left cursor-pointer"
                    >
                        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {label}
                    </button>
                </Collapsible.Trigger>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="p-5 border-t border-gray-100">{children}</div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    );
}

/* ─── SectionEditor: lightweight form for multi-section page view ── */

interface SectionEditorProps {
    data: any;
    onChange: (newData: any) => void;
    sectionId: string;
}

export function SectionEditor({ data, onChange, sectionId }: SectionEditorProps) {
    const [mode, setMode] = useState<"form" | "json">("form");
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState(false);

    // Sync JSON text when switching to JSON mode
    useEffect(() => {
        if (mode === "json") {
            setJsonText(JSON.stringify(data, null, 2));
            setJsonError(false);
        }
    }, [mode]);

    const handleJsonChange = (text: string) => {
        setJsonText(text);
        try {
            const parsed = JSON.parse(text);
            onChange(parsed);
            setJsonError(false);
        } catch {
            setJsonError(true);
        }
    };

    return (
        <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setMode("form")}
                    className={`px-4 py-3 font-text text-xs font-medium rounded-md transition-colors ${mode === "form"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                        }`}
                >
                    Editor
                </button>
                <button
                    type="button"
                    onClick={() => setMode("json")}
                    className={`px-4 py-3 font-text text-xs font-medium rounded-md transition-colors ${mode === "json"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                        }`}
                >
                    JSON
                </button>
            </div>

            {/* Editor content */}
            {mode === "form" ? (
                <ObjectFields data={data} onChange={onChange} path={`section-${sectionId}`} />
            ) : (
                <div className="relative">
                    <textarea
                        value={jsonText}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className={`w-full min-h-[300px] font-mono text-sm p-4 bg-white rounded-xl border
                                    focus:outline-none focus:ring-2 focus:ring-black/5 resize-y transition-all ${jsonError
                                ? "border-red-300 focus:border-red-400"
                                : "border-gray-200 focus:border-black/20"
                            }`}
                        spellCheck={false}
                    />
                    {jsonError && (
                        <p className="text-red-500 text-xs mt-1.5 font-text">Invalid JSON</p>
                    )}
                </div>
            )}
        </div>
    );
}
