"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useState, useRef } from "react";
import Logo from "@/app/img/crisp-logo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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

export function NavbarDesktop({ isHidden }: NavbarDesktopProps) {
    const [isMenuHovered, setIsMenuHovered] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);

    // 1. Scroll-based animation (shrunk state)
    useGSAP(() => {
        if (!innerRef.current) return;

        ScrollTrigger.create({
            trigger: document.body,
            start: "top -20",
            onToggle: (self) => {
                const isScrolled = self.isActive;
                gsap.to(innerRef.current, {
                    paddingTop: isScrolled ? "0.5rem" : "0.75rem",
                    paddingBottom: isScrolled ? "0.5rem" : "0.75rem",
                    // Lock px-4 (1rem = 16px) padding
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                if (!isMenuHovered) {
                    gsap.to(navbarRef.current, {
                        xPercent: -50,
                        left: "50%",
                        scale: isScrolled ? 0.75 : 1,
                        boxShadow: isScrolled
                            ? "0 20px 60px rgba(0,0,0,0.12)"
                            : "0 8px 32px rgba(0,0,0,0.04)",
                        duration: 0.7,
                        ease: "power3.out",
                        overwrite: "auto"
                    });
                }
            }
        });
    }, { dependencies: [isMenuHovered], scope: navbarRef });

    // 2. Desktop Menu Hover Animation
    useGSAP(() => {
        if (isMenuHovered) {
            const tl = gsap.timeline({ overwrite: "auto" });

            tl.to(navbarRef.current, {
                xPercent: -50,
                left: "50%",
                maxWidth: "1000px",
                scale: 1,
                boxShadow: "0 30px 90px rgba(0,0,0,0.15)",
                duration: 0.7,
                ease: "power4.out"
            }, 0);

            tl.to(menuButtonRef.current, {
                opacity: 0,
                x: 20,
                duration: 0.3,
                ease: "power2.out"
            }, 0);

            tl.fromTo(".menu-desktop-item",
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power4.out" },
                "-=0.4"
            );
        } else if (hasMounted.current) {
            const isScrolled = window.scrollY > 20;
            const duration = 0.7;

            const tl = gsap.timeline({ overwrite: "auto" });

            tl.to(navbarRef.current, {
                xPercent: -50,
                left: "50%",
                maxWidth: "714px",
                scale: isScrolled ? 0.75 : 1,
                boxShadow: isScrolled ? "0 20px 60px rgba(0,0,0,0.12)" : "0 8px 32px rgba(0,0,0,0.04)",
                duration: duration,
                ease: "power3.out"
            }, 0);

            tl.to(".menu-desktop-item", {
                x: -20,
                opacity: 0,
                duration: 0.3,
                stagger: { each: 0.05, from: "end" },
                ease: "power2.inOut"
            }, 0);

            tl.to(menuButtonRef.current, {
                opacity: 1,
                x: 0,
                duration: duration,
                ease: "power3.out",
                delay: 0.2
            }, 0);
        }

        if (!hasMounted.current) hasMounted.current = true;
    }, { dependencies: [isMenuHovered], scope: navbarRef });

    // 3. Visibility Logic (Hidden by Hero)
    useGSAP(() => {
        gsap.to(navbarRef.current, {
            opacity: isHidden ? 0 : 1,
            y: isHidden ? -160 : 0,
            duration: 0.7,
            ease: "power3.inOut",
            overwrite: "auto"
        });
    }, [isHidden]);

    return (
        <header
            ref={navbarRef}
            className="fixed z-50 left-1/2 -translate-x-1/2 hidden lg:block bg-white border border-black/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl pointer-events-auto"
            style={{ top: "32px", width: "calc(100% - 48px)", maxWidth: "714px" }}
        >
            <div
                ref={innerRef}
                className="flex flex-col w-full relative p-3 px-4"
                onMouseEnter={() => setIsMenuHovered(true)}
                onMouseLeave={() => setIsMenuHovered(false)}
            >
                <div className="flex items-center w-full h-[54px] shrink-0">
                    <div className="flex-1 flex justify-start items-center">
                        <Link href="/" className="flex items-center">
                            <Image src={Logo} alt="Crisp Logo" priority className="h-9 w-auto" />
                        </Link>
                    </div>

                    <div className={clsx(
                        "flex items-center justify-center transition-all duration-500 overflow-hidden",
                        isMenuHovered ? "max-w-xl opacity-100" : "max-w-0 opacity-0"
                    )}>
                        <div className="flex items-center gap-[36px] px-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.path}
                                    className="menu-desktop-item text-h3 font-bold whitespace-nowrap text-text/40 hover:text-brand transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-4 shrink-0">
                        <div
                            ref={menuButtonRef}
                            className="flex items-center gap-4 px-6 py-3 rounded-lg cursor-pointer text-text transition-all duration-300 hover:bg-black/[0.03]"
                        >
                            <div className="flex flex-col gap-1.5 pointer-events-none">
                                <div className="w-5 h-[2px] bg-current"></div>
                                <div className="w-5 h-[2px] bg-current"></div>
                            </div>
                            <span className="text-h3 font-bold">Menu</span>
                        </div>

                        <div className="shrink-0">
                            <Button variant="filled" size="medium" showLeftIcon={false} showRightIcon={false}>
                                Discuss a project
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
