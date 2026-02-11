"use client";

import { useState, useRef, useEffect } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Calendar, Mail, MessageSquare, X } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

export function ContactOverlay() {
    const { isOpen, closeContactForm } = useContactForm();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formContentRef = useRef<HTMLDivElement>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Responsive sizing logic for 1300px breakpoint
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 1300);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const { contextSafe } = useGSAP({ scope: overlayRef });

    // Handle Open/Close Animations
    useGSAP(() => {
        if (isOpen) {
            // Lock scroll
            document.body.style.overflow = "hidden";

            // Animating background content
            gsap.to(["main:not(.contact-overlay-main)", "footer"], {
                scale: 0.94,
                opacity: 0,
                filter: "blur(10px)",
                duration: 1,
                ease: "power4.inOut"
            });

            gsap.to("header", {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: "power4.inOut",
                pointerEvents: "none"
            });

            // Animating Overlay In
            gsap.set(overlayRef.current, { display: "flex", opacity: 0 });

            if (window.innerWidth < 768) {
                // Mobile slide from right
                gsap.fromTo(overlayRef.current,
                    { x: "100%", opacity: 1 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "expo.inOut" }
                );
            } else {
                // Desktop scale up and fade in
                gsap.fromTo(contentRef.current,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" }
                );
                gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
            }

            if (videoRef.current) {
                videoRef.current.play().catch(() => { });
            }
        } else {
            // Unlock scroll
            document.body.style.overflow = "";

            // Animating background content back
            gsap.to(["main:not(.contact-overlay-main)", "footer"], {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.inOut"
            });

            gsap.to("header", {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "power3.inOut",
                pointerEvents: "auto"
            });

            // Animating Overlay Out
            if (window.innerWidth < 768) {
                gsap.to(overlayRef.current, {
                    x: "100%",
                    duration: 0.6,
                    ease: "expo.inOut",
                    onComplete: () => {
                        gsap.set(overlayRef.current, { display: "none" });
                    }
                });
            } else {
                gsap.to(contentRef.current, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power4.in"
                });
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    onComplete: () => {
                        gsap.set(overlayRef.current, { display: "none" });
                    }
                });
            }
        }
    }, [isOpen]);

    const handleInteractionStart = contextSafe(() => {
        if (isInteracting) return;
        setIsInteracting(true);

        gsap.to(titleRef.current, {
            scale: 0.75,
            transformOrigin: "left center",
            duration: 1.2,
            ease: "power3.inOut"
        });

        gsap.to(formContentRef.current, {
            y: -60,
            duration: 1.2,
            ease: "power3.inOut"
        });

        if (videoRef.current) {
            gsap.to(videoRef.current, {
                playbackRate: 0,
                duration: 2.5,
                ease: "power2.inOut",
                onComplete: () => videoRef.current?.pause()
            });
        }
    });

    const handleInteractionReset = contextSafe(() => {
        if (videoRef.current) {
            videoRef.current.play();
            gsap.to(videoRef.current, {
                playbackRate: 1,
                duration: 1.5,
                ease: "power2.inOut"
            });
        }

        if (!isInteracting) return;
        setIsInteracting(false);

        gsap.to(titleRef.current, { scale: 1, duration: 1.2, ease: "power3.inOut" });
        gsap.to(formContentRef.current, { y: 0, duration: 1.2, ease: "power3.inOut" });
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formContentRef.current && !formContentRef.current.contains(event.target as Node)) {
                handleInteractionReset();
            }
        };

        if (isInteracting) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isInteracting, handleInteractionReset]);

    const buttonSizeClasses = isSmallScreen ? "w-[50px] h-[50px] rounded-[25px]" : "w-[70px] h-[70px] rounded-[35px]";
    const iconSize = isSmallScreen ? 18 : 24;
    const tooltipPosition = isSmallScreen ? "-top-[42px]" : "-top-[48px]";

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] hidden items-center justify-center bg-white/10 backdrop-blur-sm contact-overlay-wrapper"
            style={{ display: "none" }}
        >
            <main
                ref={contentRef}
                className="contact-overlay-main w-full h-full bg-white flex flex-col md:flex-row relative shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={closeContactForm}
                    className="absolute top-24 right-24 md:top-48 md:right-48 w-64 h-64 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 hover:bg-neutral-900 transition-all duration-500 group z-[110] shadow-2xl"
                >
                    <Image
                        src="/img/icons/cross.svg"
                        alt="Close"
                        width={20}
                        height={20}
                        className="group-hover:rotate-90 transition-transform duration-500"
                    />
                </button>

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-32 md:p-64 overflow-y-auto">
                    <div ref={formContentRef} className="w-full max-w-[520px]">
                        {!isSubmitted ? (
                            <>
                                <h1 ref={titleRef} className="font-mega text-mega-h2 leading-[var(--lh-mega)] tracking-[var(--ls-mega)] uppercase mb-48 md:mb-64 whitespace-nowrap">
                                    HI THERE!
                                </h1>
                                <ContactForm
                                    onSuccess={() => setIsSubmitted(true)}
                                    onInteractionStart={handleInteractionStart}
                                />
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="font-mega text-mega-h2 leading-[var(--lh-mega)] tracking-[var(--ls-mega)] uppercase mb-24">
                                    THANK YOU!
                                </h2>
                                <p className="text-text-md text-text mb-32">
                                    We&apos;ve received your message and will get back to you soon.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-brand underline hover:no-underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Video (Desktop Only) */}
                <div className="hidden md:block md:w-1/2 bg-[#F1F5F9] relative overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                        onClick={handleInteractionReset}
                    >
                        <source src="/img/crisp-chucha.webm" type="video/webm" />
                    </video>

                    {/* Circle Actions */}
                    <div className="absolute bottom-48 left-1/2 -translate-x-1/2 flex gap-12 z-20">
                        <div className="relative group/tooltip">
                            <a
                                href="https://calendly.com/roman-crisp-studio/30-minute-meeting-clone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            >
                                <Calendar size={iconSize} />
                            </a>
                            <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                                Book a meeting
                            </span>
                        </div>

                        <div className="relative group/tooltip">
                            <a
                                href="mailto:hello@crisp-studio.com"
                                className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            >
                                <Mail size={iconSize} />
                            </a>
                            <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                                Email us
                            </span>
                        </div>

                        <div className="relative group/tooltip">
                            <a
                                href="https://api.whatsapp.com/send/?phone=41794540545&text=hi%20crisp,%20lets%20discuss%20a%20project"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            >
                                <MessageSquare size={iconSize} />
                            </a>
                            <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                                Contact via WhatsApp
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
