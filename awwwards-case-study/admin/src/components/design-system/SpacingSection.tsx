import React from "react";

const SpacingBlock = ({ size, value }: { size: string, value: string }) => (
    <div className="flex flex-col gap-12 group">
        <div className="h-64 bg-gray-50 rounded-xl flex items-center p-12 relative overflow-hidden">
            <div
                className="bg-brand h-16 rounded-full"
                style={{ width: `var(--space-${size})` }}
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 font-mono text-xs opacity-30">
                {value}
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-40">
                Space {size}
            </span>
            <code className="text-[10px] font-mono text-brand bg-brand/5 px-6 py-2 rounded w-fit">
                var(--space-{size})
            </code>
        </div>
    </div>
);

export function SpacingSection() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-32">
                {[4, 8, 12, 16, 20, 24, 32, 48, 64].map((size) => (
                    <SpacingBlock key={size} size={String(size)} value={`${size}px`} />
                ))}
            </div>
        </div>
    );
}
