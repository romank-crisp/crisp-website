"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterLink, SocialLink, FooterContent as IFooterContent } from "@/content/footer";

import { useBrand } from "@/context/BrandContext";

export interface FooterProps {
    data: {
        navigation: FooterLink[];
        socials: SocialLink[];
        content: {
            ctaText: string;
            copyrightSuffix: string;
        };
    };
}

export function Footer({ data }: FooterProps) {
    const { brand } = useBrand();
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    if (pathname === "/contact") return null;

    const { navigation: footerNavigation, socials: socialLinks, content: footerContent } = data;

    return (
        <footer className="relative bg-[#07070F] text-white pt-32 md:pt-64 pb-8 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col h-full">

                {/* Big Text */}
                <div className="mb-32 md:mb-64">
                    <h2 className="font-mega text-mega-h2 text-brand text-center md:text-left uppercase">
                        {brand.name} Studio
                    </h2>
                </div>

                {/* Navigation & Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/20 pt-16 pb-32">

                    {/* Left Links */}
                    <div className="md:col-span-6 flex gap-8 md:gap-16 text-sm font-bold uppercase tracking-widest">
                        {footerNavigation.map((link) => (
                            <Link key={link.label} href={link.path} className="hover:text-brand transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right CTA */}
                    <div className="md:col-span-6 flex md:justify-end">
                        <Link href="/contact" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors underline decoration-white/30 underline-offset-4">
                            {footerContent.ctaText}
                        </Link>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-auto pt-32 pb-8 gap-8 md:gap-0 opacity-40 text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-8">
                        {socialLinks.map((link) => {
                            const isInternal = link.url.startsWith("/");
                            if (isInternal) {
                                return (
                                    <Link key={link.label} href={link.url} className="hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                );
                            }
                            return (
                                <a key={link.label} href={link.url} className="hover:text-white transition-colors">
                                    {link.label}
                                </a>
                            );
                        })}
                        <Link href="/admin" className="hover:text-white transition-colors text-white/50">Admin</Link>
                    </div>
                    <div>
                        ©{currentYear} {brand.name} Studio. {footerContent.copyrightSuffix}
                    </div>
                </div>
            </div>
        </footer>
    );
}
