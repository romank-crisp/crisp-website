"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
// Removed: import Logo from "@/app/img/crisp-logo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, ArrowRight } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

gsap.registerPlugin(ScrollTrigger);

interface NavbarDesktopProps {
    isHidden?: boolean;
}

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works/centrogreen" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" }
];

export function NavbarDesktop() {
    const { openContactForm, isNavHidden } = useContactForm();
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);
    const menuItemsRef = useRef<HTMLDivElement>(null);
    const menuTriggerRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // 1. Scroll-based resizing with "Return on Stop" logic
    useGSAP(() => {
        if (!navbarRef.current) return;

        const handleScroll = () => {
            // Shrink on scroll
            gsap.to(navbarRef.current, {
                scale: 0.8,
                y: -10,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });

            // Reset timeout to detect stop
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                gsap.to(navbarRef.current, {
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }, 150);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, { scope: navbarRef });

    // 2. Menu Expansion Animation via GSAP (Fixes CSS max-width bounce/contraction)
    useGSAP(() => {
        if (!menuItemsRef.current || !menuTriggerRef.current) return;

        // Animate Menu Items (Expand)
        gsap.to(menuItemsRef.current, {
            maxWidth: isMenuHovered ? 600 : 0,
            opacity: isMenuHovered ? 1 : 0,
            paddingRight: isMenuHovered ? 50 : 0,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: "auto"
        });

        // Animate Menu Trigger (Collapse)
        gsap.to(menuTriggerRef.current, {
            maxWidth: isMenuHovered ? 0 : 200,
            opacity: isMenuHovered ? 0 : 1,
            paddingRight: isMenuHovered ? 0 : 24,
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: "auto"
        });
    }, [isMenuHovered]);

    // 3. Menu Visibility
    useGSAP(() => {
        gsap.to(navbarRef.current, {
            opacity: isNavHidden ? 0 : 1,
            pointerEvents: isNavHidden ? "none" : "auto",
            duration: 0.5,
            ease: "power2.inOut",
            overwrite: "auto"
        });
    }, [isNavHidden]);

    return (
        <header
            ref={navbarRef}
            className="fixed z-50 top-32 left-1/2 -translate-x-1/2 hidden lg:block bg-white border border-black/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full pointer-events-auto origin-top"
        >
            <nav
                className="flex items-center h-[96px] px-32 relative"
                onMouseEnter={() => setIsMenuHovered(true)}
                onMouseLeave={() => setIsMenuHovered(false)}
            >
                {/* Logo Section */}
                <div className="flex items-center shrink-0 pr-[50px]">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/img/crisp-logo.svg"
                            alt="Crisp Logo"
                            width={100}
                            height={33}
                            priority
                            className="w-auto h-[33px]"
                        />
                    </Link>
                </div>

                {/* Dynamic Center Section: Items vs Trigger */}
                <div className="flex items-center relative">
                    {/* Menu Items (Expansion) */}
                    <div
                        ref={menuItemsRef}
                        className="flex items-center overflow-hidden opacity-0"
                        style={{ maxWidth: 0 }}
                    >
                        <div className="flex items-center gap-32">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.path}
                                    className="text-h3 font-bold whitespace-nowrap text-text/40 hover:text-brand transition-colors duration-500"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Menu Trigger (Counterpart) */}
                    <div
                        ref={menuTriggerRef}
                        className="flex items-center overflow-hidden"
                    >
                        <div className="flex items-center gap-8 text-text whitespace-nowrap">
                            <Menu size={20} />
                            <span className="text-h3 font-bold">Menu</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center shrink-0">
                    <Button
                        variant="filled"
                        size="medium"
                        rightIcon={ArrowRight}
                        onClick={openContactForm}
                        className="text-h3 font-bold px-32 h-[56px]"
                    >
                        Discuss a project
                    </Button>
                </div>
            </nav>
        </header>
    );
}
