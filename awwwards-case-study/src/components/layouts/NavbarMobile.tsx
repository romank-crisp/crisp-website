"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
// Removed module import to use public path instead
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { X, Calendar, Mail, MessageSquare, Menu } from "lucide-react";

interface NavbarMobileProps {
    isHidden?: boolean;
}

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works/centrogreen" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" }
];

import { useContactForm } from "@/context/ContactFormContext";

export function NavbarMobile() {
    const { openContactForm, isNavHidden } = useContactForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const mobileContentRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);

    const handleOpenContact = () => {
        setIsMenuOpen(false);
        openContactForm();
    };

    // 1. Scroll-based resizing
    useGSAP(() => {
        if (!navbarRef.current || isMenuOpen) return;

        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            gsap.to(navbarRef.current, {
                scale: isScrolled ? 0.8 : 1,
                y: isScrolled ? -5 : 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, { dependencies: [isMenuOpen] });

    // 2. Expansion & Closing Animation
    useGSAP(() => {
        if (!innerRef.current || !mobileContentRef.current) return;

        if (isMenuOpen) {
            gsap.killTweensOf([navbarRef.current, innerRef.current, ".mobile-item", ".mobile-footer-item"]);
            const tl = gsap.timeline();

            tl.to(navbarRef.current, {
                top: 0,
                width: "100%",
                maxWidth: "100%",
                left: "50%",
                xPercent: -50,
                scale: 1,
                y: 0,
                borderRadius: 0,
                duration: 0.6,
                ease: "expo.inOut"
            }, 0);

            tl.to(innerRef.current, {
                height: "100vh",
                padding: "32px",
                duration: 0.6,
                ease: "expo.inOut"
            }, 0);

            tl.set(mobileContentRef.current, { display: "flex", opacity: 0 }, "-=0.2");
            tl.to(mobileContentRef.current, { opacity: 1, duration: 0.3 });

            tl.fromTo(".mobile-item",
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power4.out" },
                "-=0.1"
            );

            tl.fromTo(".mobile-footer-item",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
                "-=0.3"
            );
        } else if (hasMounted.current) {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (mobileContentRef.current) gsap.set(mobileContentRef.current, { display: "none" });
                }
            });

            tl.to(mobileContentRef.current, { opacity: 0, duration: 0.2 });

            tl.to(innerRef.current, {
                height: "72px",
                padding: "12px 16px",
                duration: 0.6,
                ease: "expo.inOut"
            }, "+=0.1");

            tl.to(navbarRef.current, {
                top: "24px",
                width: "calc(100% - 32px)",
                maxWidth: "600px",
                xPercent: -50,
                scale: window.scrollY > 20 ? 0.8 : 1,
                borderRadius: "2rem",
                duration: 0.6,
                ease: "expo.inOut"
            }, "<");
        }

        if (!hasMounted.current) hasMounted.current = true;
    }, { dependencies: [isMenuOpen] });

    // 3. Visibility logic
    useGSAP(() => {
        if (isMenuOpen) return;
        gsap.to(navbarRef.current, {
            opacity: isNavHidden ? 0 : 1,
            pointerEvents: isNavHidden ? "none" : "auto",
            duration: 0.5,
            ease: "power2.inOut"
        });
    }, [isNavHidden, isMenuOpen]);

    // Body Scroll Lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <header
            ref={navbarRef}
            className="fixed z-50 top-24 left-1/2 -translate-x-1/2 lg:hidden bg-white border border-black/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] pointer-events-auto overflow-hidden origin-top"
            style={{ width: "calc(100% - 32px)", maxWidth: "600px" }}
        >
            <div
                ref={innerRef}
                className="flex flex-col w-full relative p-3 px-4 h-[72px] justify-center"
            >
                <div className="flex items-center justify-between w-full shrink-0">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center pl-8">
                        <Image src="/img/crisp-logo.svg" alt="Crisp Logo" width={100} height={28} priority className="h-7 w-auto" />
                    </Link>

                    <div className="flex items-center gap-8 pr-4">
                        {!isMenuOpen && (
                            <Button
                                variant="filled"
                                size="small"
                                onClick={handleOpenContact}
                                className="!text-[12px] h-[36px] px-12"
                            >
                                Let&apos;s talk
                            </Button>
                        )}

                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-6 px-12 py-6 rounded-full cursor-pointer text-text transition-all duration-300 hover:bg-black/[0.03]"
                        >
                            {isMenuOpen ? (
                                <>
                                    <X size={18} className="text-text" />
                                    <span className="text-h4 font-bold">Close</span>
                                </>
                            ) : (
                                <>
                                    <Menu size={18} className="text-text" />
                                    <span className="text-h4 font-bold">Menu</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    ref={mobileContentRef}
                    className="hidden flex-col justify-between pt-64 pb-64 w-full h-full"
                >
                    <nav className="flex flex-col gap-24 px-8 items-start text-left mt-32">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="mobile-item text-h1 font-bold leading-none tracking-tight hover:text-brand transition-colors opacity-0"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col gap-12 px-8 items-start w-full">
                            <Button
                                variant="filled"
                                size="medium"
                                className="mobile-footer-item w-full justify-start gap-12 px-24 h-[56px] rounded-2xl opacity-0 !text-[16px]"
                                leftIcon={Calendar}
                                onClick={handleOpenContact}
                            >
                                Discuss a project
                            </Button>

                            <Button
                                variant="transparent"
                                size="medium"
                                className="mobile-footer-item w-full justify-start gap-12 px-24 text-text opacity-0 hover:opacity-100 h-[48px] !text-[14px]"
                                leftIcon={Mail}
                                onClick={handleOpenContact}
                            >
                                Write a message
                            </Button>

                            <Button
                                variant="transparent"
                                size="medium"
                                className="mobile-footer-item w-full justify-start gap-12 px-24 text-text opacity-0 hover:opacity-100 h-[48px] !text-[14px]"
                                leftIcon={MessageSquare}
                                onClick={handleOpenContact}
                            >
                                Contact via Whatsapp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
