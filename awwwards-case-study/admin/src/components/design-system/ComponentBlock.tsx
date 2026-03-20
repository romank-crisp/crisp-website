import React from "react";
import { clsx } from "clsx";

interface ComponentBlockProps {
    children: React.ReactNode;
    label: string;
    classNameDisplay?: string;
}

export const ComponentBlock = ({
    children,
    label,
    classNameDisplay
}: ComponentBlockProps) => (
    <div className="flex flex-col items-center gap-12 group w-full">
        <div className="flex items-center justify-center p-12 min-h-[120px] w-full bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors border border-black/5">
            {children}
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-40">
                {label}
            </span>
            {classNameDisplay && (
                <code className="text-[10px] font-mono text-brand bg-brand/5 px-6 py-2 rounded">
                    {classNameDisplay}
                </code>
            )}
        </div>
    </div>
);
