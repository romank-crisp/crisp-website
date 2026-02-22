"use client";

import { useBrand } from "@/context/BrandContext";
import { useContactForm } from "@/context/ContactFormContext";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Calendar, Mail, MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const SharedVideoScrollingCTA = () => {
    const { brand } = useBrand();
    const { openContactForm } = useContactForm();
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const slotRef = useRef<HTMLSpanElement>(null);
    const ctasRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !stickyRef.current || !videoWrapperRef.current || !headlineRef.current || !slotRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // Helper to calculate target geometry relative to the sticky container
        const getTargetState = () => {
            if (!slotRef.current || !videoWrapperRef.current || !stickyRef.current) return { x: 0, y: 0, width: "100%", height: "100%" };

            const slotRect = slotRef.current.getBoundingClientRect();
            const stickyRect = stickyRef.current.getBoundingClientRect();

            return {
                x: slotRect.left - stickyRect.left,
                y: slotRect.top - stickyRect.top,
                width: slotRect.width,
                height: slotRect.height
            };
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
            zIndex: 0
        });

        // Ensure text is on top
        gsap.set(headlineRef.current, { zIndex: 10, position: "relative" });
        gsap.set(ctasRef.current, { zIndex: 10, position: "relative" });

        // Video Scale Animation
        tl.to(videoWrapperRef.current, {
            x: () => getTargetState().x,
            y: () => getTargetState().y,
            width: () => getTargetState().width as any,
            height: () => getTargetState().height as any,
            borderRadius: "12px",
            ease: "none",
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-text">
            <div ref={stickyRef} className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Animated Video Wrapper */}
                <div
                    ref={videoWrapperRef}
                    className="z-0 overflow-hidden will-change-transform"
                    style={{ position: 'absolute' }}
                >
                    <video
                        ref={videoRef}
                        src="/img/showreel-cta.webm"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 text-center pointer-events-none max-w-[1475px] mx-auto w-full px-16 md:px-64">
                    <h1 ref={headlineRef} className="font-mega text-mega-h2 uppercase text-white">
                        <span className="inline-block relative z-10 mix-blend-difference">BRING</span>
                        <span
                            ref={slotRef}
                            className="inline-block w-[1.8em] h-[0.70em] mx-3 align-middle opacity-0"
                        />
                        <span className="inline-block relative z-10 mix-blend-difference">YOUR</span>
                        <br />
                        <span className="inline-block relative z-10 mix-blend-difference">PRODUCT TO MARKET FASTER.</span>
                    </h1>

                    <div
                        ref={ctasRef}
                        className="mt-32 md:mt-48 flex flex-col md:flex-row flex-wrap justify-center gap-12 md:gap-16 pointer-events-auto"
                    >
                        <Button
                            variant="filled"
                            size="large"
                            leftIcon={Calendar}
                            onClick={openContactForm}
                            className="text-white hover:brightness-110 w-full md:w-auto"
                        >
                            Schedule a meeting
                        </Button>
                        <Button
                            variant="outline"
                            size="large"
                            leftIcon={Mail}
                            href="mailto:hello@crisp.studio"
                            className="text-white border-white hover:bg-white/10 w-full md:w-auto"
                        >
                            Email us
                        </Button>
                        <Button
                            variant="outline"
                            size="large"
                            leftIcon={MessageCircle}
                            href="https://wa.me/41794540545"
                            className="text-white border-white hover:bg-white/10 w-full md:w-auto"
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
