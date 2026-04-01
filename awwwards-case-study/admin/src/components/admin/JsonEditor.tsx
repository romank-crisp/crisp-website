"use client";

import { useState, useEffect, useCallback } from "react";

// styles
import "prismjs/themes/prism.css";

// Prism
import Prism from "prismjs";
import "prismjs/components/prism-json";

import Editor from "react-simple-code-editor";
import { suggestJsonUpdate } from "@/app/actions/ai-editor";
import * as Tabs from "@radix-ui/react-tabs";

const { highlight, languages } = Prism;

interface JsonEditorProps {
    filename: string;
    title?: string;
    initialData: any;
    isEditable?: boolean;
    onChange?: (data: string) => void;
    settingsPanel?: React.ReactNode;
}

export function JsonEditor({ filename, title, initialData, isEditable = true, onChange, settingsPanel }: JsonEditorProps) {
    const [data, setData] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setData(JSON.stringify(initialData, null, 2));
        } else {
            setData("{}");
        }
    }, [initialData]);

    const handleChange = useCallback((value: string) => {
        setData(value);
        onChange?.(value);
        try {
            JSON.parse(value);
            setError(null);
        } catch (e) {
            // wait for valid json
        }
    }, [onChange]);

    const [prompt, setPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const handleAiSubmit = async () => {
        if (!prompt.trim()) return;
        setAiLoading(true);
        setAiError(null);
        try {
            const currentJson = JSON.parse(data);
            const result = await suggestJsonUpdate(currentJson, prompt);
            if (result.success && result.data) {
                const newData = JSON.stringify(result.data, null, 2);
                setData(newData);
                onChange?.(newData);
                setPrompt("");
            } else {
                setAiError(result.error || "Failed to generate suggestion.");
            }
        } catch (e) {
            setAiError("Invalid current JSON. Please fix errors before using AI.");
        } finally {
            setAiLoading(false);
        }
    };

    const tabValues = ["json", "ai", ...(settingsPanel ? ["settings"] : [])];

    return (
        <Tabs.Root defaultValue="json" className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5 shrink-0">
                <h2 className="font-heading text-lg font-bold capitalize text-black">
                    {title || filename.replace(".json", "").replace(/-/g, " ")}
                </h2>

                {isEditable && (
                    <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        <Tabs.Trigger
                            value="json"
                            className="px-4 py-2 font-text text-xs font-medium rounded-md transition-colors cursor-pointer
                                       data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                                       data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-black"
                        >
                            JSON
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="ai"
                            className="px-4 py-2 font-text text-xs font-medium rounded-md transition-colors cursor-pointer
                                       data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                                       data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-black"
                        >
                            AI Prompt
                        </Tabs.Trigger>
                        {settingsPanel && (
                            <Tabs.Trigger
                                value="settings"
                                className="px-4 py-2 font-text text-xs font-medium rounded-md transition-colors cursor-pointer
                                           data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                                           data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-black"
                            >
                                Settings
                            </Tabs.Trigger>
                        )}
                    </Tabs.List>
                )}

                {error && <span className="font-text text-red-500 text-xs">{error}</span>}
            </div>

            {/* Tab content */}
            <div className="flex-grow flex flex-col min-h-0">
                {/* JSON tab */}
                <Tabs.Content value="json" className="flex-grow flex flex-col min-h-0 outline-none">
                    <div className="flex-grow w-full bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-black/10 focus-within:border-gray-400 overflow-hidden relative transition-all">
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
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                    backgroundColor: 'transparent',
                                    minHeight: '100%'
                                }}
                                textareaClassName="focus:outline-none"
                            />
                        </div>
                    </div>
                </Tabs.Content>

                {/* Settings tab */}
                {settingsPanel && (
                    <Tabs.Content value="settings" className="flex-grow w-full overflow-hidden outline-none">
                        {settingsPanel}
                    </Tabs.Content>
                )}

                {/* AI tab */}
                <Tabs.Content value="ai" className="flex-grow flex flex-col outline-none">
                    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
                        <div className="w-full space-y-5 pt-2">
                            <div className="text-left">
                                <h3 className="font-heading text-base font-semibold text-gray-900 flex items-center gap-2">
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
                                    className="font-text w-full h-[60vh] p-6 pr-36 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 text-sm resize-none placeholder:text-gray-400 leading-relaxed transition-all"
                                    disabled={aiLoading}
                                />

                                <button
                                    onClick={handleAiSubmit}
                                    disabled={aiLoading || !prompt.trim()}
                                    className="absolute bottom-4 right-4 w-24 h-24 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black"
                                >
                                    {aiLoading ? (
                                        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {aiLoading && (
                                <p className="font-text text-sm text-gray-500 animate-pulse text-center">Generating suggestions...</p>
                            )}

                            {aiError && (
                                <div className="font-text p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
                                    {aiError}
                                </div>
                            )}

                            <p className="font-text text-xs text-gray-400 text-center">Press ⌘ + Enter to send</p>
                        </div>
                    </div>
                </Tabs.Content>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
                code[class*="language-"], pre[class*="language-"] { text-shadow: none !important; font-family: inherit !important; }
                .token.property { color: #0d9488; }
                .token.string { color: #d97706; }
                .token.number { color: #2563eb; }
                .token.boolean { color: #7c3aed; }
            `}</style>
        </Tabs.Root>
    );
}
