"use client";

import { useState, useRef, useEffect } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Calendar, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formContentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
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

    const { contextSafe } = useGSAP({ scope: containerRef });

    const handleInteractionStart = contextSafe(() => {
        if (isInteracting) return;
        setIsInteracting(true);

        // Scale down "Hi There!" - refined values to prevent sliding off canvas
        gsap.to(titleRef.current, {
            scale: 0.75,
            transformOrigin: "left center",
            duration: 1.2,
            ease: "power3.inOut"
        });

        // Move form up - refined Y value
        gsap.to(formContentRef.current, {
            y: -60,
            duration: 1.2,
            ease: "power3.inOut"
        });

        // Slowly pause video
        if (videoRef.current) {
            gsap.to(videoRef.current, {
                playbackRate: 0,
                duration: 2.5,
                ease: "power2.inOut",
                onComplete: () => {
                    videoRef.current?.pause();
                }
            });
        }
    });

    const handleInteractionReset = contextSafe(() => {
        // Resume video regardless of interaction state
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

        // Reset title scale
        gsap.to(titleRef.current, {
            scale: 1,
            duration: 1.2,
            ease: "power3.inOut"
        });

        // Reset form position
        gsap.to(formContentRef.current, {
            y: 0,
            duration: 1.2,
            ease: "power3.inOut"
        });
    });

    // Handle clicks outside the form content to reset animation
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
        <main ref={containerRef} className="min-h-screen flex flex-col md:flex-row bg-white relative">
            {/* Close Button (Hero Style) */}
            <Link
                href="/"
                className="absolute top-24 right-24 md:fixed md:top-48 md:right-48 w-64 h-64 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 hover:bg-neutral-900 transition-all duration-500 group z-50 shadow-2xl"
            >
                <Image
                    src="/img/icons/cross.svg"
                    alt="Close"
                    width={20}
                    height={20}
                    className="group-hover:rotate-90 transition-transform duration-500"
                />
            </Link>

            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-32 md:p-64">
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

                {/* Circle Actions Bottom Middle */}
                <div className="absolute bottom-48 left-1/2 -translate-x-1/2 flex gap-12 z-20">
                    <div className="relative group/tooltip">
                        <button
                            className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            title="Book a meeting"
                        >
                            <Calendar size={iconSize} />
                        </button>
                        <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                            Book a meeting
                        </span>
                    </div>

                    <div className="relative group/tooltip">
                        <button
                            className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            title="Write a message"
                        >
                            <Mail size={iconSize} />
                        </button>
                        <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                            Write a message
                        </span>
                    </div>

                    <div className="relative group/tooltip">
                        <button
                            className={`${buttonSizeClasses} bg-white flex items-center justify-center shadow-[0_8px_48px_rgba(0,0,0,0.12)] text-text transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-black hover:text-white`}
                            title="Contact via WhatsApp"
                        >
                            <MessageSquare size={iconSize} />
                        </button>
                        <span className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 bg-black text-white text-[10px] uppercase tracking-widest font-bold px-12 h-[36px] flex items-center rounded pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap`}>
                            Contact via WhatsApp
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
