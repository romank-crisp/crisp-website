"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterContent } from "@/content/footer";
import { useBrand } from "@/context/BrandContext";

export interface FooterProps {
    data: FooterContent;
}

export function Footer({ data }: FooterProps) {
    const pathname = usePathname();
    const { brand } = useBrand();

    // Hide footer on contact page if needed, but the design shows a full footer.
    // Given the request is to "recreate footer", I'll follow the design exactly.
    if (pathname === "/contact") return null;

    const { columns, copyright, bottomCta } = data;

    return (
        <footer className="relative bg-text text-white pt-64 pb-32 overflow-hidden">
            <div className="max-w-[1475px] mx-auto px-32 md:px-64 flex flex-col h-full">

                {/* Top Divider Line */}
                <div className="w-full h-[1px] bg-white/10 mb-64" />

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-32 md:gap-64 mb-64">
                    {columns.map((column, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            {column.links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.path}
                                    className="text-[11px] md:text-[13px] font-medium uppercase tracking-[0.2em] hover:text-brand transition-colors w-fit"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Bottom Divider Line */}
                <div className="w-full h-[1px] bg-white/10 mb-32" />

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] md:text-[11px] uppercase tracking-[0.15em] opacity-60">
                    <div className="text-center md:text-left">
                        {copyright.replace("{year}", new Date().getFullYear().toString())}
                    </div>
                    <Link
                        href={brand.contactUrl || bottomCta.path}
                        className="hover:text-white transition-colors underline underline-offset-4 decoration-white/30"
                    >
                        {bottomCta.label}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
