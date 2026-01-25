"use client";

import { useState, useEffect } from "react";

export default function TypographyPage() {
    const [brand, setBrand] = useState<"crisp" | "brand-a">("crisp");

    useEffect(() => {
        document.documentElement.setAttribute("data-brand", brand);
    }, [brand]);

    const styles = [
        { name: "Mega H1", className: "font-mega text-mega-h1", label: "Variable Mega Font / Size" },
        { name: "Mega H2", className: "font-mega text-mega-h2", label: "Variable Mega Font / Size" },
        { name: "H1", className: "font-heading text-h1", label: "Variable Heading Font / Size" },
        { name: "H2", className: "font-heading text-h2", label: "Variable Heading Font / Size" },
        { name: "H3", className: "font-heading text-h3", label: "Variable Heading Font / Size" },
        { name: "H4", className: "font-heading text-h4", label: "Variable Heading Font / Size" },
        { name: "Text LG", className: "font-text text-text-lg", label: "Variable Text Font / Size" },
        { name: "Text MD", className: "font-text text-text-md", label: "Variable Text Font / Size" },
        { name: "Text SM", className: "font-text text-text-sm", label: "Variable Text Font / Size" },
    ];

    return (
        <div className="min-h-screen p-64 bg-white text-text grid gap-48 transition-colors duration-500">
            <header className="border-b border-text/10 pb-24 mb-24 flex justify-between items-end">
                <div>
                    <h1 className="font-heading text-h1">Typography Setup</h1>
                    <p className="font-text text-text-md opacity-60">Figma to Tailwind Tokens Verification</p>
                </div>

                <div className="flex gap-16 items-center bg-gray-100 p-8 rounded-full border border-gray-200">
                    <button
                        onClick={() => setBrand("crisp")}
                        className={`px-16 py-8 rounded-full text-text-sm transition-all ${brand === "crisp" ? "bg-white shadow text-black font-bold" : "text-gray-500"}`}
                    >
                        Crisp (Default)
                    </button>
                    <button
                        onClick={() => setBrand("brand-a")}
                        className={`px-16 py-8 rounded-full text-text-sm transition-all ${brand === "brand-a" ? "bg-white shadow text-black font-bold" : "text-gray-500"}`}
                    >
                        Capptoo (Brand A)
                    </button>
                </div>
            </header>

            <div className="grid gap-64">
                {styles.map((style) => (
                    <div key={style.name} className="grid grid-cols-[200px_1fr] gap-32 border-b border-text/10 pb-32">
                        <div className="flex flex-col gap-4">
                            <span className="font-text text-text-sm font-bold text-brand uppercase tracking-widest">{style.name}</span>
                            <span className="font-text text-text-sm opacity-50 font-mono">{style.label}</span>
                            <code className="font-mono text-xs bg-gray-100 p-1 rounded w-fit">{style.className}</code>
                        </div>
                        <div className={style.className}>
                            The quick brown fox 0123456789
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-64 pt-64 border-t border-text">
                <h2 className="font-heading text-h2 mb-32">Colors & Spacing</h2>
                <div className="grid grid-cols-2 gap-32">
                    <div className="space-y-16">
                        <h3 className="text-h4">Colors</h3>
                        <div className="flex gap-16">
                            <div className="w-64 h-64 bg-brand grid place-content-center text-white text-xs">Brand</div>
                            <div className="w-64 h-64 bg-text grid place-content-center text-white text-xs">Text</div>
                            <div className="w-64 h-64 bg-white border border-text/10 grid place-content-center text-text text-xs">White</div>
                        </div>
                    </div>
                    <div className="space-y-16">
                        <h3 className="text-h4">Spacing Scale</h3>
                        <div className="flex items-end gap-1">
                            {[4, 8, 12, 16, 24, 32, 48, 64].map(s => (
                                <div key={s} style={{ height: `var(--space-${s})`, width: '10px' }} className="bg-brand" title={`space-${s}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
