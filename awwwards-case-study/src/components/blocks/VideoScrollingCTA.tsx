"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Calendar, Mail, MessageSquare } from "lucide-react";

export function VideoScrollingCTA() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !videoWrapperRef.current || !placeholderRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        // Reset any existing transforms
        gsap.set(videoWrapperRef.current, {
            clearProps: "all"
        });

        // Initial state: Full screen, top-left aligned
        gsap.set(videoWrapperRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            borderRadius: "0px",
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            position: "absolute",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // Animation steps:

        // 1. Scale Dimensions (Width/Height)
        tl.to(videoWrapperRef.current, {
            width: () => placeholderRef.current!.offsetWidth,
            height: () => placeholderRef.current!.offsetHeight,
            borderRadius: 20,
            ease: "none",
            duration: 1,
        }, 0);

        // 2. Animate Position (x/y) manually in onUpdate to handle dynamic target matching
        tl.to({}, {
            duration: 1,
            ease: "none",
            onUpdate: function () {
                if (!placeholderRef.current || !videoWrapperRef.current || !containerRef.current) return;

                const progress = this.progress(); // 0 to 1

                const cRect = containerRef.current.getBoundingClientRect();
                const pRect = placeholderRef.current.getBoundingClientRect();

                const targetX = pRect.left - cRect.left;
                const targetY = pRect.top - cRect.top;

                const currentX = targetX * progress;
                const currentY = targetY * progress;

                gsap.set(videoWrapperRef.current, {
                    x: currentX,
                    y: currentY
                });
            }
        }, 0);

        // 3. Fade in CTA content
        tl.fromTo(contentRef.current, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 0.2);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-[#07070F] overflow-hidden flex flex-col items-center justify-center">
            {/* The Scaling Video Wrapper */}
            <div
                ref={videoWrapperRef}
                className="z-20 overflow-hidden pointer-events-none origin-top-left"
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

            {/* The CTA Content */}
            <div ref={contentRef} className="relative z-10 w-full max-w-[1440px] px-32 text-white flex flex-col items-center opacity-0">
                <h2 className="text-mega-h2 font-mega leading-[1] uppercase text-center mb-64 max-w-[1200px]">
                    BRING
                    <span
                        ref={placeholderRef}
                        className="inline-block w-[140px] md:w-[160px] h-[80px] md:h-[100px] align-middle mx-16 rounded-2xl invisible"
                    ></span>
                    YOUR PRODUCT<br />
                    TO MARKET <span className="text-brand">FASTER</span>
                </h2>

                <div className="flex flex-wrap gap-24 justify-center pointer-events-auto">
                    <Button size="large" showLeftIcon={false} showRightIcon={false} className="gap-12 pl-24 pr-32">
                        <Calendar size={20} />
                        <span>Schedule a meeting</span>
                    </Button>
                    <Button variant="outline" size="large" showLeftIcon={false} showRightIcon={false} className="text-white border-white/30 hover:border-white/60 hover:bg-white/5 gap-12 pl-24 pr-32">
                        <Mail size={20} />
                        <span>Email us</span>
                    </Button>
                    <Button variant="outline" size="large" showLeftIcon={false} showRightIcon={false} className="text-white border-white/30 hover:border-white/60 hover:bg-white/5 gap-12 pl-24 pr-32">
                        <MessageSquare size={20} />
                        <span>WhatsApp</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
