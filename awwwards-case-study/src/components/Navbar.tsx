"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Logo from "@/app/img/crisp-logo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Link from "next/link";

interface NavbarProps {
    isHidden?: boolean;
}

export function Navbar({ isHidden }: NavbarProps) {
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const navbarRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLDivElement>(null);

    const menuItems = [
        { label: "Home", path: "/" },
        { label: "Works", path: "/works/centrogreen" },
        { label: "About", path: "/about" },
        { label: "Services", path: "/services" }
    ];

    // 1. Scroll-based animation (shrunk state)
    useGSAP(() => {
        if (!innerRef.current) return;

        ScrollTrigger.create({
            start: "top -20",
            onToggle: (self) => {
                const isScrolled = self.isActive;
                gsap.to(innerRef.current, {
                    paddingTop: isScrolled ? "0.5rem" : "0.75rem",
                    paddingBottom: isScrolled ? "0.5rem" : "0.75rem",
                    boxShadow: isScrolled
                        ? "0 20px 50px rgba(0,0,0,0.1)"
                        : "0 8px 32px rgba(0,0,0,0.04)",
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                // Only scale if NOT in hovered state (hover takes precedence)
                if (!isMenuHovered) {
                    gsap.to(navbarRef.current, {
                        scale: isScrolled ? 0.75 : 1,
                        duration: 0.7,
                        ease: "power3.out",
                        overwrite: "auto"
                    });
                }
            }
        });
    }, { scope: navbarRef, dependencies: [isMenuHovered] });

    // 2. Menu Hover Animation
    useGSAP(() => {
        if (isMenuHovered) {
            // Expanded appearance
            gsap.to(navbarRef.current, {
                maxWidth: "1100px",
                scale: 1,
                duration: 0.7,
                ease: "power4.out",
                overwrite: "auto"
            });

            gsap.to(menuButtonRef.current, {
                opacity: 0,
                x: 20,
                width: 0,
                paddingLeft: 0,
                paddingRight: 0,
                duration: 0.4,
                ease: "power2.inOut",
                overwrite: "auto"
            });

            gsap.fromTo(".menu-item-reveal",
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power4.out", delay: 0.1, overwrite: "auto" }
            );
        } else {
            // Return to normal/scroll state
            const isScrolled = window.scrollY > 20;

            gsap.to(navbarRef.current, {
                maxWidth: "714px",
                scale: isScrolled ? 0.75 : 1,
                duration: 0.7,
                ease: "power3.out",
                overwrite: "auto"
            });

            gsap.to(".menu-item-reveal", {
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: { each: 0.05, from: "end" },
                ease: "power2.inOut",
                overwrite: "auto"
            });

            gsap.to(menuButtonRef.current, {
                opacity: 1,
                x: 0,
                width: "auto",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                duration: 0.5,
                ease: "power3.out",
                delay: 0.2,
                overwrite: "auto"
            });
        }
    }, { dependencies: [isMenuHovered], scope: navbarRef });

    // 3. Visibility logic (Hidden by Hero)
    useGSAP(() => {
        gsap.to(navbarRef.current, {
            opacity: isHidden ? 0 : 1,
            y: isHidden ? -160 : 0,
            pointerEvents: isHidden ? "none" : "auto",
            duration: 0.7,
            ease: "power3.inOut",
            overwrite: "auto"
        });
    }, [isHidden]);

    return (
        <header
            ref={navbarRef}
            className="fixed top-8 left-1/2 z-50 w-[calc(100%-48px)] -translate-x-1/2 will-change-transform"
            style={{ transformOrigin: "center top" }}
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
        >
            <div
                ref={innerRef}
                className={`bg-white px-8 py-3 rounded-2xl flex items-center justify-between border border-black/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.04)]`}
            >
                {/* Left: Logo */}
                <Link href="/" className="flex items-center shrink-0 hover:scale-105 transition-transform">
                    <Image
                        src={Logo}
                        alt="Crisp Logo"
                        priority
                        className="h-8 w-auto transition-all"
                    />
                </Link>

                {/* Center: Menu Items */}
                <div
                    ref={menuItemsRef}
                    className={`flex items-center justify-center transition-all duration-500 ease-in-out ${isMenuHovered ? 'max-w-[850px] opacity-100 flex-1' : 'max-w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="flex items-center gap-[36px] pointer-events-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                className={`menu-item-reveal text-xl font-bold whitespace-nowrap transition-colors duration-300 cursor-pointer ${hoveredItem === null
                                    ? "text-[#120c2a]"
                                    : hoveredItem === item.label
                                        ? "text-[#e00c33]"
                                        : "text-[#120c2a]/30"
                                    }`}
                                onMouseEnter={() => setHoveredItem(item.label)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className={`flex items-center shrink-0 ${isMenuHovered ? 'gap-0' : 'gap-4'}`}>
                    <div
                        ref={menuButtonRef}
                        className="flex items-center gap-4 px-6 py-3.5 rounded-lg cursor-pointer text-[#120c2a] overflow-hidden whitespace-nowrap"
                    >
                        <div className="flex flex-col gap-1.5 shrink-0">
                            <div className="w-6 h-[2.5px] bg-current"></div>
                            <div className="w-6 h-[2.5px] bg-current"></div>
                        </div>
                        <span className="text-xl font-bold">Menu</span>
                    </div>

                    <button className="bg-[#e00c33] hover:bg-[#c00a2b] text-white px-8 py-3.5 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 shrink-0">
                        Discuss a project
                    </button>
                </div>
            </div>
        </header>
    );
}
