"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

// styles
import "prismjs/themes/prism.css"; // Basic theme

// Default import for Prism instance
import Prism from "prismjs";
// Language definition (runs side effects, needs Prism)
import "prismjs/components/prism-json";

import Editor from "react-simple-code-editor";
import { suggestJsonUpdate } from "@/app/actions/ai-editor";

// Use Prism directly for highlight and languages
const { highlight, languages } = Prism;

interface JsonEditorProps {
    filename: string;
    title?: string;
    liveUrl?: string;
    initialData: any;
    isEditable?: boolean;
    onSave: (filename: string, data: any) => Promise<void>;
}

export function JsonEditor({ filename, title, liveUrl, initialData, isEditable = true, onSave }: JsonEditorProps) {
    const [data, setData] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"json" | "ai" | "preview">(isEditable ? "json" : "preview");

    // Ensure activeTab syncs if isEditable changes
    useEffect(() => {
        if (!isEditable && activeTab !== "preview") {
            setActiveTab("preview");
        } else if (isEditable && activeTab === "preview" && !liveUrl) {
            setActiveTab("json");
        }
    }, [isEditable, activeTab, liveUrl]);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setData(JSON.stringify(initialData, null, 2));
        } else {
            setData("{}"); // Explicit fallback to stringified empty object instead of empty string
        }
    }, [initialData]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const parsed = JSON.parse(data);
            await onSave(filename, parsed);
        } catch (e) {
            setError("Invalid JSON format. Please fix errors before saving.");
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (value: string) => {
        setData(value);
        try {
            JSON.parse(value);
            setError(null);
        } catch (e) {
            // valid json check
        }
    };

    // Keyboard shortcut for Cmd+S / Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [data, handleSave]);

    const [prompt, setPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const handleAiSubmit = async () => {
        if (!prompt.trim()) return;
        setAiLoading(true);
        setAiError(null);
        try {
            // Parse current data to send valid JSON
            const currentJson = JSON.parse(data);
            const result = await suggestJsonUpdate(currentJson, prompt);

            if (result.success && result.data) {
                setData(JSON.stringify(result.data, null, 2));
                setActiveTab("json"); // Switch back to view changes
                setPrompt(""); // Clear prompt on success
            } else {
                setAiError(result.error || "Failed to generate suggestion.");
            }
        } catch (e) {
            setAiError("Invalid current JSON. Please fix errors before using AI.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Header / Tabs */}
            <div className="relative flex items-center justify-center py-1 border-b border-gray-200 min-h-[48px] shrink-0">
                {/* Left: Title */}
                <div className="absolute left-0 flex items-center">
                    {liveUrl ? (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 font-heading text-xl font-bold capitalize transition-colors hover:text-brand"
                        >
                            <span>{title || filename}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    ) : (
                        <h2 className="font-heading text-xl font-bold capitalize">
                            {title || filename}
                        </h2>
                    )}
                </div>

                {/* Center: Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {isEditable && (
                        <>
                            <button
                                onClick={() => setActiveTab("json")}
                                className={`px-3 py-1 font-text text-xs font-medium rounded-md transition-colors ${activeTab === "json" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                JSON
                            </button>
                            <button
                                onClick={() => setActiveTab("ai")}
                                className={`px-3 py-1 font-text text-xs font-medium rounded-md transition-colors ${activeTab === "ai" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                AI Prompt
                            </button>
                        </>
                    )}
                    {liveUrl && (
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`px-3 py-1 font-text text-xs font-medium rounded-md transition-colors ${activeTab === "preview" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                                }`}
                        >
                            Preview
                        </button>
                    )}
                </div>

                {/* Right: Error */}
                {error && <span className="absolute right-0 font-text text-red-500 text-sm">{error}</span>}
            </div>

            {/* Content Area */}
            <div className="flex-grow flex flex-col min-h-0">
                {activeTab === "json" ? (
                    <div className="flex flex-col h-full gap-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-heading text-sm font-semibold text-gray-700">Change content in JSON</h3>
                            <Button onClick={handleSave} disabled={saving} size="small">
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="flex-grow w-full bg-gray-50 rounded-xl border border-transparent focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black/10 overflow-hidden relative">
                            <div className="absolute inset-0 overflow-auto custom-scrollbar">
                                <Editor
                                    value={data}
                                    onValueChange={handleChange}
                                    highlight={code => {
                                        try {
                                            return highlight(code, languages.json, 'json');
                                        } catch (e) {
                                            return code;
                                        }
                                    }}
                                    padding={20}
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 14,
                                        backgroundColor: 'transparent',
                                        minHeight: '100%'
                                    }}
                                    textareaClassName="focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ) : activeTab === "ai" ? (
                    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-8">
                        <div className="w-full space-y-4 pt-4">
                            <div className="text-left">
                                <h3 className="font-heading text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="text-brand">✦</span> AI Content Editor
                                </h3>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && prompt.trim()) {
                                            handleAiSubmit();
                                        }
                                    }}
                                    placeholder="Paste new text here or suggest AI improvement (e.g. 'Make the title more engaging')"
                                    className="font-text w-full h-[70vh] p-8 pr-44 bg-white rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-black text-base resize-none placeholder:text-gray-400"
                                    disabled={aiLoading}
                                />

                                <button
                                    onClick={handleAiSubmit}
                                    disabled={aiLoading || !prompt.trim()}
                                    className="absolute bottom-6 right-6 w-32 h-32 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black"
                                >
                                    {aiLoading ? (
                                        <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {aiLoading && (
                                <div className="text-center">
                                    <p className="font-text text-sm text-gray-500 animate-pulse">Generating suggestions...</p>
                                </div>
                            )}

                            {aiError && (
                                <div className="font-text p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
                                    {aiError}
                                </div>
                            )}

                            <div className="text-center">
                                <p className="font-text text-xs text-gray-400">Press ⌘ + Enter to send</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden relative">
                        {liveUrl ? (
                            <iframe
                                src={liveUrl}
                                className="w-full h-full border-none"
                                title="Live Preview"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 font-text">
                                No live preview available for this JSON file.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx global>{`
                /* Improve scrollbar for the editor */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
                
                /* Override prism styles for better integration */
                code[class*="language-"],
                pre[class*="language-"] {
                    text-shadow: none !important;
                    font-family: inherit !important;
                }
                /* Token colors override if needed */
                .token.property { color: #0d9488; }
                .token.string { color: #d97706; }
                .token.number { color: #2563eb; }
                .token.boolean { color: #7c3aed; }
            `}</style>
        </div>
    );
}
