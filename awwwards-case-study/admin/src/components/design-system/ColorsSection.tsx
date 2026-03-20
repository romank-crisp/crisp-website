import React from "react";

export function ColorsSection() {
    return (
        <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-32">
                {/* Brand */}
                <div className="space-y-12">
                    <div className="w-full h-80 bg-brand rounded-2xl border border-black/5" />
                    <div className="space-y-4">
                        <h3 className="font-heading text-h4 font-bold">Brand</h3>
                        <p className="font-text text-sm opacity-50 font-mono">var(--color-brand)</p>
                    </div>
                </div>
                {/* Text */}
                <div className="space-y-12">
                    <div className="w-full h-80 bg-text rounded-2xl border border-black/5" />
                    <div className="space-y-4">
                        <h3 className="font-heading text-h4 font-bold">Text (Dark)</h3>
                        <p className="font-text text-sm opacity-50 font-mono">var(--color-text)</p>
                    </div>
                </div>
                {/* White */}
                <div className="space-y-12">
                    <div className="w-full h-80 bg-white rounded-2xl border border-black/10" />
                    <div className="space-y-4">
                        <h3 className="font-heading text-h4 font-bold">White</h3>
                        <p className="font-text text-sm opacity-50 font-mono">var(--color-white)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
