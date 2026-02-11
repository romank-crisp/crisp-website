"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";
import { useBrand } from "@/context/BrandContext";

gsap.registerPlugin(ScrollTrigger);

export function VideoScrollingCTA() {
    const { brand } = useBrand();
    const { openContactForm } = useContactForm();
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const slotRef = useRef<HTMLSpanElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const ctasRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            if (!slotRef.current || !videoWrapperRef.current || !stickyRef.current) return;
            const slotRect = slotRef.current.getBoundingClientRect();
            const stickyRect = stickyRef.current.getBoundingClientRect();

            gsap.set(videoWrapperRef.current, {
                width: slotRect.width,
                height: slotRect.height,
                x: slotRect.left - stickyRect.left,
                y: slotRect.top - stickyRect.top,
                borderRadius: "12px",
            });
            // CTAs are always visible now, but we ensure full opacity
            gsap.set(ctasRef.current, { opacity: 1, y: 0 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // 1. Video Shrink Animation
        const updateVideoTransform = () => {
            if (!slotRef.current || !videoWrapperRef.current || !stickyRef.current) return;

            const slotRect = slotRef.current.getBoundingClientRect();
            const stickyRect = stickyRef.current.getBoundingClientRect();

            const targetX = slotRect.left - stickyRect.left;
            const targetY = slotRect.top - stickyRect.top;
            const targetWidth = slotRect.width;
            const targetHeight = slotRect.height;

            tl.to(videoWrapperRef.current, {
                x: targetX,
                y: targetY,
                width: targetWidth,
                height: targetHeight,
                borderRadius: "12px",
                ease: "none",
            }, 0);
        };

        // Initial setup
        gsap.set(videoWrapperRef.current, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            x: 0,
            y: 0,
        });

        updateVideoTransform();

        // Re-calculate on resize
        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-black">
            <div ref={stickyRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Animated Video Wrapper */}
                <div
                    ref={videoWrapperRef}
                    className="z-0 overflow-hidden will-change-transform"
                    style={{ position: 'absolute' }}
                >
                    <video
                        ref={videoRef}
                        src="/img/bottomvideo.webm"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 text-center px-4 pointer-events-none">
                    <h1 ref={headlineRef} className="font-mega text-[10vw] md:text-[7vw] leading-[0.85] uppercase text-white tracking-tight">
                        <span className="inline-block">BRING</span>
                        <span
                            ref={slotRef}
                            className="inline-block w-[1.4em] h-[0.75em] mx-3 align-middle bg-white/5 rounded-xl"
                        />
                        <span className="inline-block">YOUR</span>
                        <br />
                        <span className="inline-block">PRODUCT TO MARKET FASTER.</span>
                    </h1>

                    <div
                        ref={ctasRef}
                        className="mt-32 md:mt-48 flex flex-wrap justify-center gap-12 md:gap-16 pointer-events-auto"
                    >
                        <Button
                            variant="filled"
                            size="large"
                            leftIcon={Calendar}
                            onClick={openContactForm}
                            className="!bg-white !text-black !border-white hover:!bg-brand hover:!text-white hover:!border-brand"
                        >
                            Schedule a meeting
                        </Button>
                        <Button
                            variant="outline"
                            size="large"
                            leftIcon={Mail}
                            href={`mailto:hello@${brand.name.toLowerCase()}.studio`}
                            className="!text-white !border-white/20 hover:!border-white hover:!bg-white/10"
                        >
                            Email us
                        </Button>
                        <Button
                            variant="outline"
                            size="large"
                            leftIcon={MessageCircle}
                            href="https://wa.me/yourwhatsappnumber"
                            className="!text-white !border-white/20 hover:!border-white hover:!bg-white/10"
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
