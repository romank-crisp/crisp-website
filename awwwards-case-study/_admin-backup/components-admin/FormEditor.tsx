"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";

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

/* ─── FieldLabel ───────────────────────────────────────────────────── */

function FieldLabel({ label, htmlFor }: { label: string; htmlFor?: string }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block font-text text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2"
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
                className="w-full max-h-[160px] object-contain rounded-lg border border-gray-100 bg-gray-50 mt-3"
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
                className="w-full max-h-[160px] object-contain rounded-lg border border-gray-100 bg-gray-50 mt-3"
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

    if (!isObject) {
        return (
            <div className="group relative border border-gray-200 rounded-xl bg-white transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                    <span className="font-text text-xs font-medium text-gray-400 flex-1">
                        #{index + 1}
                    </span>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1.5 rounded-md hover:bg-red-50"
                        title="Remove item"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
                <div className="p-5">
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
            <div className="group relative border border-gray-200 rounded-xl bg-white transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                    <Collapsible.Trigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors flex-1 text-left"
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
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1.5 rounded-md hover:bg-red-50"
                        title="Remove item"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="p-5">
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

    /* Boolean → Radix Switch */
    if (typeof value === "boolean") {
        return (
            <div className="flex items-center gap-3 py-1">
                <Switch.Root
                    id={id}
                    checked={value}
                    onCheckedChange={onChange}
                    className="relative w-[42px] h-[25px] bg-gray-200 rounded-full data-[state=checked]:bg-black transition-colors cursor-pointer outline-none"
                >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
                <label htmlFor={id} className="font-text text-sm text-gray-600 cursor-pointer select-none">
                    {value ? "Enabled" : "Disabled"}
                </label>
            </div>
        );
    }

    /* Number */
    if (typeof value === "number") {
        return (
            <input
                id={id}
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="font-text w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />
        );
    }

    /* String */
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
                        className="font-text w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 resize-y transition-all
                                   leading-relaxed"
                    />
                    {showMedia && <MediaPreview url={value} />}
                </div>
            );
        }

        return (
            <div>
                <div className="relative">
                    {showMedia && (
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                            <ImageIcon size={14} className="text-gray-400" />
                        </div>
                    )}
                    <input
                        id={id}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`font-text w-full h-10 text-sm bg-white border border-gray-200 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all
                                    ${showMedia ? "pl-10 pr-3" : "px-3"}`}
                    />
                </div>
                {showMedia && <MediaPreview url={value} />}
            </div>
        );
    }

    /* Fallback: JSON */
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
            className="font-text w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
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
        <div className="space-y-6">
            {Object.entries(data).map(([key, value]) => {
                const fieldPath = `${path}.${key}`;

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
            <div className="space-y-3">
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
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-black
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
                        className="w-full flex items-center gap-2.5 px-5 py-3.5 bg-gray-50/80 hover:bg-gray-100/80
                                   font-text text-sm font-semibold text-gray-700 transition-colors text-left cursor-pointer"
                    >
                        <span className="text-gray-400">
                            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                        {label}
                    </button>
                </Collapsible.Trigger>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="p-5 border-t border-gray-100 bg-white">{children}</div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    );
}

/* ─── SectionEditor: Radix Tabs for Editor/JSON mode ───────────────── */

interface SectionEditorProps {
    data: any;
    onChange: (newData: any) => void;
    sectionId: string;
}

export function SectionEditor({ data, onChange, sectionId }: SectionEditorProps) {
    const [jsonText, setJsonText] = useState("");
    const [jsonError, setJsonError] = useState(false);

    const handleJsonFocus = () => {
        setJsonText(JSON.stringify(data, null, 2));
        setJsonError(false);
    };

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
        <Tabs.Root defaultValue="form" className="flex flex-col gap-5">
            <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                <Tabs.Trigger
                    value="form"
                    className="px-4 py-2 font-text text-xs font-medium rounded-md transition-colors
                               data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                               data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-black cursor-pointer"
                >
                    Editor
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="json"
                    className="px-4 py-2 font-text text-xs font-medium rounded-md transition-colors
                               data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                               data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-black cursor-pointer"
                >
                    JSON
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="form" className="outline-none">
                <ObjectFields data={data} onChange={onChange} path={`section-${sectionId}`} />
            </Tabs.Content>

            <Tabs.Content value="json" className="outline-none" onFocusCapture={handleJsonFocus}>
                <div className="relative">
                    <textarea
                        value={jsonText}
                        onFocus={handleJsonFocus}
                        onChange={(e) => handleJsonChange(e.target.value)}
                        className={`w-full min-h-[300px] font-mono text-sm p-4 bg-white rounded-xl border
                                    focus:outline-none focus:ring-2 focus:ring-black/10 resize-y transition-all leading-relaxed ${
                                        jsonError
                                            ? "border-red-300 focus:border-red-400"
                                            : "border-gray-200 focus:border-gray-400"
                                    }`}
                        spellCheck={false}
                    />
                    {jsonError && (
                        <p className="text-red-500 text-xs mt-2 font-text">Invalid JSON</p>
                    )}
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
}
