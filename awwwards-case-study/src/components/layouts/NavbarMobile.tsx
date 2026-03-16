"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { X, Calendar, Mail, MessageSquare, Menu, ArrowRight } from "lucide-react";

interface NavbarMobileProps {
    isHidden?: boolean;
}

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works" },
    { label: "About", path: "/about" },
    // { label: "Services", path: "/services" }
];

import { useContactForm } from "@/context/ContactFormContext";
import { useBrand } from "@/context/BrandContext";

export function NavbarMobile() {
    const { brand } = useBrand();
    const { openContactForm, isNavHidden } = useContactForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);

    const handleOpenContact = () => {
        setIsMenuOpen(false);
        openContactForm();
    };

    // Scroll-based resizing (lightweight — keep)
    useGSAP(() => {
        if (!navbarRef.current || isMenuOpen) return;

        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            gsap.to(navbarRef.current, {
                scale: isScrolled ? 0.8 : 1,
                y: isScrolled ? -5 : 0,
                boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, { dependencies: [isMenuOpen] });

    // Visibility logic (lightweight — keep)
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

    // Reset scale/transform when menu opens/closes
    useEffect(() => {
        if (!navbarRef.current) return;
        if (isMenuOpen) {
            gsap.set(navbarRef.current, { scale: 1, y: 0 });
        }
    }, [isMenuOpen]);

    return (
        <header
            ref={navbarRef}
            className={`fixed z-[9100] left-1/2 -translate-x-1/2 lg:hidden bg-white border border-black/[0.03] pointer-events-auto overflow-hidden origin-top transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen
                    ? "top-0 w-full !max-w-full h-dvh rounded-none shadow-none"
                    : "top-24 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                }`}
            style={isMenuOpen ? {} : { width: "calc(100% - 32px)", maxWidth: "600px" }}
        >
            <div
                className={`flex flex-col w-full relative transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? "h-dvh p-8" : "h-[72px] p-3 px-4 justify-center"
                    }`}
            >
                <div className="flex items-center justify-between w-full shrink-0">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center pl-8">
                        <Image
                            src={brand.logo}
                            alt={`${brand.name} Logo`}
                            width={100}
                            height={28}
                            priority
                            className="h-7 w-auto transition-transform duration-300 origin-left hover:scale-105"
                            style={{ transform: `scale(${brand.logoScale || 1})` }}
                        />
                    </Link>

                    <div className="flex items-center gap-8 pr-4">
                        <Button
                            variant="filled"
                            size="small"
                            onClick={handleOpenContact}
                            className={`!text-[12px] h-[36px] px-12 transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 pointer-events-auto scale-100'}`}
                        >
                            Let&apos;s talk
                        </Button>

                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-[12px] px-12 py-6 rounded-full cursor-pointer text-text transition-all duration-300 hover:bg-black/[0.03]"
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

                {/* Mobile Content — CSS transition driven */}
                <div
                    className={`flex flex-col justify-between pt-64 pb-64 w-full flex-1 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none hidden"
                        }`}
                >
                    <nav className="flex flex-col gap-24 px-8 items-start text-left mt-32">
                        {menuItems.map((item, i) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-h1 font-bold leading-none tracking-tight hover:text-brand transition-all duration-500"
                                style={{
                                    opacity: isMenuOpen ? 1 : 0,
                                    transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
                                    transitionDelay: isMenuOpen ? `${150 + i * 60}ms` : "0ms",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col gap-12 px-8 items-start w-full">
                            {[
                                { label: "Discuss a project", icon: ArrowRight, iconPos: "right" as const, variant: "filled" as const, onClick: handleOpenContact },
                                { label: "Book a meeting", icon: Calendar, iconPos: "left" as const, variant: "outline" as const, href: "https://calendly.com/roman-crisp-studio/30-minute-meeting-clone" },
                                { label: "Email us", icon: Mail, iconPos: "left" as const, variant: "outline" as const, href: "mailto:hello@crisp-studio.com" },
                                { label: "Contact via Whatsapp", icon: MessageSquare, iconPos: "left" as const, variant: "outline" as const, href: "https://api.whatsapp.com/send/?phone=41794540545&text=hi%20crisp,%20lets%20discuss%20a%20project" },
                            ].map((btn, i) => (
                                <Button
                                    key={btn.label}
                                    variant={btn.variant}
                                    size="medium"
                                    className="w-full justify-center gap-12 px-24 h-[56px] rounded-2xl !text-[16px] transition-all duration-500"
                                    leftIcon={btn.iconPos === "left" ? btn.icon : undefined}
                                    rightIcon={btn.iconPos === "right" ? btn.icon : undefined}
                                    onClick={btn.onClick}
                                    href={btn.href}
                                    style={{
                                        opacity: isMenuOpen ? 1 : 0,
                                        transform: isMenuOpen ? "translateY(0)" : "translateY(16px)",
                                        transitionDelay: isMenuOpen ? `${350 + i * 60}ms` : "0ms",
                                    }}
                                >
                                    {btn.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}
