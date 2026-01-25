import React from "react";
import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#07070F] text-white pt-32 md:pt-64 pb-8 overflow-hidden">
            <div className="container mx-auto px-8 md:px-16 flex flex-col h-full">

                {/* Big Text */}
                <div className="mb-32 md:mb-64">
                    <h2 className="font-mega text-mega-h2 text-brand text-center md:text-left uppercase">
                        Crisp Studio
                    </h2>
                </div>

                {/* Navigation & Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/20 pt-16 pb-32">

                    {/* Left Links */}
                    <div className="md:col-span-6 flex gap-8 md:gap-16 text-sm font-bold uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
                        <Link href="/works/centrogreen" className="hover:text-brand transition-colors">Works</Link>
                        <Link href="/about" className="hover:text-brand transition-colors">About</Link>
                        <Link href="/services" className="hover:text-brand transition-colors">Services</Link>
                    </div>

                    {/* Right CTA */}
                    <div className="md:col-span-6 flex md:justify-end">
                        <Link href="/contact" className="text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors underline decoration-white/30 underline-offset-4">
                            New business inquires click here
                        </Link>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-auto pt-32 pb-8 gap-8 md:gap-0 opacity-40 text-xs uppercase tracking-wider">
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/design-system" className="hover:text-white transition-colors">Design System</Link>
                        <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                        <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
                        <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                    </div>
                    <div>
                        ©{currentYear} Crisp Studio. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
