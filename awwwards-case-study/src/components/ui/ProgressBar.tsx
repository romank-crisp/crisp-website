"use client";

import React from "react";

interface ProgressBarProps {
    progress: number; // 0 to 1
    className?: string;
}

export function ProgressBar({ progress, className = "" }: ProgressBarProps) {
    return (
        <div className={`w-full h-1 bg-gray-200 fixed bottom-0 left-0 z-50 ${className}`}>
            <div
                className="h-full bg-brand transition-all duration-100 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
            />
        </div>
    );
}
