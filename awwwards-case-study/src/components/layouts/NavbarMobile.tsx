"use client";

import { clsx } from "clsx";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Logo from "@/app/img/crisp-logo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { X, Calendar, Mail, MessageSquare } from "lucide-react";

interface NavbarMobileProps {
    isHidden?: boolean;
}

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works/centrogreen" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" }
];

export function NavbarMobile({ isHidden }: NavbarMobileProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const mobileContentRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);

    // Expansion & Closing Animation
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
                boxShadow: "0 30px 90px rgba(0,0,0,0.15)", // Deep shadow for expanded state
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
                height: "78px",
                padding: "12px 16px",
                duration: 0.6,
                ease: "expo.inOut"
            }, "+=0.1");

            tl.to(navbarRef.current, {
                top: "32px",
                width: "calc(100% - 48px)",
                maxWidth: "714px",
                xPercent: -50,
                scale: typeof window !== 'undefined' && window.scrollY > 20 ? 0.75 : 1,
                boxShadow: "0 8px 32px rgba(0,0,0,0.04)", // Standard shadow for collapsed state
                borderRadius: "1.5rem",
                duration: 0.6,
                ease: "expo.inOut"
            }, "<");

            tl.set(innerRef.current, { height: "auto" });
        }

        if (!hasMounted.current) hasMounted.current = true;
    }, { dependencies: [isMenuOpen] });

    // Navbar Visibility (Hidden by Hero)
    useGSAP(() => {
        if (isMenuOpen) return;
        gsap.to(navbarRef.current, {
            opacity: isHidden ? 0 : 1,
            y: isHidden ? -160 : 0,
            duration: 0.7,
            ease: "power3.inOut"
        });
    }, [isHidden, isMenuOpen]);

    // Body Scroll Lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMenuOpen]);

    return (
        <header
            ref={navbarRef}
            className="fixed z-50 left-1/2 -translate-x-1/2 lg:hidden bg-white border border-black/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl pointer-events-auto overflow-hidden"
            style={{ top: "32px", width: "calc(100% - 48px)", maxWidth: "714px" }}
        >
            <div
                ref={innerRef}
                className="flex flex-col w-full relative p-3 px-4"
            >
                <div className="flex items-center justify-between w-full h-[54px] shrink-0">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                        <Image src={Logo} alt="Crisp Logo" priority className="h-9 w-auto" />
                    </Link>

                    <div
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-4 px-6 py-3 rounded-lg cursor-pointer text-text transition-all duration-300 hover:bg-black/[0.03]"
                    >
                        {isMenuOpen ? (
                            <>
                                <X size={20} className="text-text" />
                                <span className="text-h4 font-bold">Close</span>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-1.5 pointer-events-none">
                                    <div className="w-5 h-[2px] bg-current"></div>
                                    <div className="w-5 h-[2px] bg-current"></div>
                                </div>
                                <span className="text-h4 font-bold">Menu</span>
                            </>
                        )}
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
                        <div className="flex flex-col gap-12 px-8 items-start w-full max-w-[400px]">
                            <Button variant="filled" size="medium" className="mobile-footer-item w-full justify-start gap-12 px-24 h-[60px] rounded-2xl opacity-0" showLeftIcon={false} showRightIcon={false}>
                                <Calendar size={18} />
                                <span className="font-bold">Book a meeting</span>
                            </Button>

                            <Button variant="transparent" size="medium" className="mobile-footer-item w-full justify-start gap-12 px-24 text-text opacity-0 hover:opacity-100 h-[48px]" showLeftIcon={false} showRightIcon={false}>
                                <Mail size={18} />
                                <span className="font-bold">Write a message</span>
                            </Button>

                            <Button variant="transparent" size="medium" className="mobile-footer-item w-full justify-start gap-12 px-24 text-text opacity-0 hover:opacity-100 h-[48px]" showLeftIcon={false} showRightIcon={false}>
                                <MessageSquare size={18} />
                                <span className="font-bold">Contact via Whatsapp</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
