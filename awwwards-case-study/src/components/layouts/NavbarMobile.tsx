"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { X, Calendar, Mail, MessageSquare, Menu, ArrowRight } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";
import { useBrand } from "@/context/BrandContext";

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works" },
    { label: "About", path: "/about" },
];

const PANEL_MS = 800;
const CONTENT_DELAY_MS = 700;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function NavbarMobile() {
    const { brand } = useBrand();
    const { openContactForm, isNavHidden } = useContactForm();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);   // menu items stagger
    const [showControls, setShowControls] = useState(true);   // collapsed "Let's talk" + "Menu"

    const navbarRef = useRef<HTMLElement>(null);

    /* ── Helpers ──────────────────────────────────── */

    const handleOpenContact = () => {
        setIsMenuOpen(false);
        openContactForm();
    };

    const handleOpen = () => {
        setShowControls(false);
        setIsMenuOpen(true);
    };

    const handleClose = () => {
        setShowContent(false);
        setIsMenuOpen(false);
        setTimeout(() => setShowControls(true), PANEL_MS);
    };

    /* ── Effects ──────────────────────────────────── */

    // Content reveal: show menu items after panel expands
    useEffect(() => {
        let t: NodeJS.Timeout;
        if (isMenuOpen) {
            t = setTimeout(() => setShowContent(true), CONTENT_DELAY_MS);
        } else {
            setShowContent(false);
        }
        return () => clearTimeout(t);
    }, [isMenuOpen]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    // Reset GSAP transforms when menu opens
    useEffect(() => {
        if (isMenuOpen && navbarRef.current) {
            gsap.set(navbarRef.current, { scale: 1, y: 0 });
        }
    }, [isMenuOpen]);

    // Scroll-based resizing (collapsed only)
    useGSAP(() => {
        if (!navbarRef.current || isMenuOpen) return;
        const onScroll = () => {
            const scrolled = window.scrollY > 20;
            gsap.to(navbarRef.current, {
                scale: scrolled ? 0.8 : 1,
                y: scrolled ? -5 : 0,
                boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
            });
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, { dependencies: [isMenuOpen] });

    // Hide/show based on contact form
    useGSAP(() => {
        if (isMenuOpen) return;
        gsap.to(navbarRef.current, {
            opacity: isNavHidden ? 0 : 1,
            pointerEvents: isNavHidden ? "none" : "auto",
            duration: 0.5,
            ease: "power2.inOut",
        });
    }, [isNavHidden, isMenuOpen]);

    /* ── Render ───────────────────────────────────── */

    return (
        <header
            ref={navbarRef}
            className={`
                fixed z-[9100] inset-x-0 mx-auto lg:hidden
                bg-white border border-black/[0.03]
                pointer-events-auto overflow-hidden origin-top
                ${isMenuOpen
                    ? "top-0 w-full !max-w-full rounded-none shadow-none"
                    : "top-24 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                }
            `}
            style={{
                ...(isMenuOpen ? { height: "100dvh" } : { height: "72px", width: "calc(100% - 32px)", maxWidth: "600px" }),
                transition: `all ${PANEL_MS}ms ${EASE}`,
            }}
        >
            {/* ── Top Bar — NEVER changes layout ── */}
            <div
                className="flex items-center justify-between shrink-0 px-4"
                style={{ height: "72px" }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => { setShowContent(false); setIsMenuOpen(false); }}
                    className="flex items-center pl-8"
                >
                    <Image
                        src={brand.logo}
                        alt={`${brand.name} Logo`}
                        width={100}
                        height={28}
                        priority
                        className="h-7 w-auto origin-left"
                        style={{ transform: `scale(${brand.logoScale || 1})` }}
                    />
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-8 pr-4">
                    {/* "Let's talk" — visible only in collapsed settled state */}
                    <div
                        style={{
                            opacity: !isMenuOpen && showControls ? 1 : 0,
                            transform: !isMenuOpen && showControls ? "scale(1)" : "scale(0.92)",
                            pointerEvents: !isMenuOpen && showControls ? "auto" : "none",
                            transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                            transitionDelay: !isMenuOpen && showControls ? "100ms" : "0ms",
                        }}
                    >
                        <Button
                            variant="filled"
                            size="small"
                            onClick={handleOpenContact}
                            className="!text-[12px] h-[36px] px-12"
                        >
                            Let&apos;s talk
                        </Button>
                    </div>

                    {/* Menu / Close toggle */}
                    <div
                        onClick={() => (isMenuOpen ? handleClose() : handleOpen())}
                        className="flex items-center gap-[12px] px-12 py-6 rounded-full cursor-pointer text-text hover:bg-black/[0.03]"
                        style={{
                            opacity: isMenuOpen ? 1 : (showControls ? 1 : 0),
                            pointerEvents: isMenuOpen || showControls ? "auto" : "none",
                            transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                            transitionDelay: !isMenuOpen && showControls ? "200ms" : "0ms",
                        }}
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

            {/* ── Menu Content — fills remaining space ── */}
            {isMenuOpen && (
                <div
                    className="flex flex-col justify-center flex-1 px-8"
                    style={{
                        height: "calc(100dvh - 72px)",
                        opacity: showContent ? 1 : 0,
                        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    {/* Nav links */}
                    <nav className="flex flex-col gap-24 items-center text-center mb-48">
                        {menuItems.map((item, i) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={handleClose}
                                className="text-h1 font-bold leading-none tracking-tight hover:text-brand"
                                style={{
                                    opacity: showContent ? 1 : 0,
                                    transform: showContent ? "translateY(0)" : "translateY(12px)",
                                    transition: "all 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                                    transitionDelay: showContent ? `${i * 120}ms` : "0ms",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-12 items-center w-full">
                        {[
                            { label: "Discuss a project", icon: ArrowRight, iconPos: "right" as const, variant: "filled" as const, onClick: handleOpenContact },
                            { label: "Book a meeting", icon: Calendar, iconPos: "left" as const, variant: "outline" as const, href: "https://calendly.com/roman-crisp-studio/30-minute-meeting-clone" },
                            { label: "Email us", icon: Mail, iconPos: "left" as const, variant: "outline" as const, href: "mailto:hello@crisp-studio.com" },
                            { label: "Contact via Whatsapp", icon: MessageSquare, iconPos: "left" as const, variant: "outline" as const, href: "https://api.whatsapp.com/send/?phone=41794540545&text=hi%20crisp,%20lets%20discuss%20a%20project" },
                        ].map((btn, i) => (
                            <div
                                key={btn.label}
                                className="w-full"
                                style={{
                                    opacity: showContent ? 1 : 0,
                                    transform: showContent ? "translateY(0)" : "translateY(8px)",
                                    transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                                    transitionDelay: showContent ? `${360 + i * 80}ms` : "0ms",
                                }}
                            >
                                <Button
                                    variant={btn.variant}
                                    size="medium"
                                    className="w-full justify-center gap-12 px-24 h-[56px] rounded-2xl !text-[16px]"
                                    leftIcon={btn.iconPos === "left" ? btn.icon : undefined}
                                    rightIcon={btn.iconPos === "right" ? btn.icon : undefined}
                                    onClick={btn.onClick}
                                    href={btn.href}
                                >
                                    {btn.label}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
