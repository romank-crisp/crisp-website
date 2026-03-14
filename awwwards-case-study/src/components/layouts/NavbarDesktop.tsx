"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, ArrowRight } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";
import { useBrand } from "@/context/BrandContext";

import { MenuItem } from "@/content/navigation";

export function NavbarDesktop({ menuItems }: { menuItems: MenuItem[] }) {
    const { brand } = useBrand();
    const { openContactForm, isNavHidden } = useContactForm();
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);
    const navContentRef = useRef<HTMLDivElement>(null);
    const menuTriggerRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Scroll-based resizing with "Return on Stop" logic
    useGSAP(() => {
        if (!navbarRef.current) return;

        const handleScroll = () => {
            // Don't scale during menu expansion
            if (isMenuHovered) return;

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
    }, { dependencies: [isMenuHovered], scope: navbarRef });

    // Create timeline once on mount
    useGSAP(() => {
        if (!navContentRef.current || !menuTriggerRef.current) return;

        const tl = gsap.timeline({ paused: true });

        // Step 1: Collapse Menu trigger (width, opacity, margin)
        tl.to(menuTriggerRef.current, {
            width: 0,
            opacity: 0,
            marginRight: 0,
            duration: 0.3,
            ease: "power2.out"
        });

        // Step 2: Expand the nav content width to fit content (approx 450px)
        tl.to(navContentRef.current, {
            width: 450,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.1");

        // Step 3: Staggered animation for menu items
        tl.fromTo(".navbar-menu-item",
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power4.out" },
            "-=0.4"
        );

        timelineRef.current = tl;

        return () => {
            tl.kill();
        };
    }, []); // Empty dependency array - create only once

    // Play or reverse timeline based on hover state
    useGSAP(() => {
        if (!timelineRef.current) return;

        if (timelineRef.current.progress() === 0 && !isMenuHovered) return; // optimization

        if (isMenuHovered) {
            timelineRef.current.play();
        } else {
            timelineRef.current.reverse();
        }
    }, [isMenuHovered]);

    // Menu Visibility
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
            className="fixed z-[9100] top-24 lg:top-32 left-1/2 -translate-x-1/2 hidden lg:block bg-white border border-black/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full pointer-events-auto origin-top"
            style={{ overflow: "visible" }}
        >
            <nav
                className="flex items-center gap-[40px] h-[96px] px-[32px] relative max-w-[1440px]"
                onMouseEnter={() => setIsMenuHovered(true)}
                onMouseLeave={() => setIsMenuHovered(false)}
            >
                {/* Logo Section */}
                <div className="flex items-center shrink-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            src={brand.logo}
                            alt={`${brand.name} Logo`}
                            width={100}
                            height={33}
                            priority
                            className="w-auto h-[33px] transition-transform duration-300 origin-left hover:scale-105"
                            style={{ transform: `scale(${brand.logoScale || 1})` }}
                        />
                    </Link>
                </div>

                {/* Dynamic Center Section - Menu Items */}
                <div
                    ref={navContentRef}
                    className="flex items-center overflow-hidden justify-center"
                    style={{ width: 0 }}
                >
                    <div className="flex items-center gap-[32px] whitespace-nowrap">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                className="navbar-menu-item text-h3 font-bold whitespace-nowrap text-text/40 hover:text-brand transition-colors duration-500"
                                style={{ opacity: 0 }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Section: Menu Trigger + CTA */}
                <div className="flex items-center shrink-0">
                    {/* Menu Trigger */}
                    <div
                        ref={menuTriggerRef}
                        className="flex items-center gap-8 text-text whitespace-nowrap overflow-hidden mr-6 cursor-pointer" // Added mr-6 (24px) here instead of gap
                        onClick={() => setIsMenuHovered(true)}
                    >
                        <Menu size={20} />
                        <span className="text-h3 font-bold">Menu</span>
                    </div>

                    {/* CTA Button */}
                    <Button
                        variant="filled"
                        size="medium"
                        rightIcon={ArrowRight}
                        onClick={openContactForm}
                        className="text-h3 font-bold px-[32px] h-[56px]"
                    >
                        Discuss a project
                    </Button>
                </div>
            </nav>
        </header>
    );
}
