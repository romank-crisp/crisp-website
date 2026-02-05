"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Calendar, Mail, MessageSquare } from "lucide-react";

export function VideoScrollingCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLSpanElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !videoWrapperRef.current || !placeholderRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        // Initial absolute setup: Matches the section container
        gsap.set(videoWrapperRef.current, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            clipPath: "inset(0% 0% 0% 0%)",
            borderRadius: 0,
            zIndex: 10,
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // The scaling animation: 
        // We calculate the inner-offsets relative to the 100% parent container
        tl.fromTo(videoWrapperRef.current,
            {
                clipPath: "inset(0% 0% 0% 0%)",
                borderRadius: 0,
            },
            {
                clipPath: () => {
                    const cRect = sectionRef.current!.getBoundingClientRect();
                    const pRect = placeholderRef.current!.getBoundingClientRect();

                    // Since the section is pinned at top:0, getBoundingClientRect() relative to the parent section
                    // We need the values relative to cRect
                    const top = ((pRect.top - cRect.top) / cRect.height) * 100;
                    const left = ((pRect.left - cRect.left) / cRect.width) * 100;
                    const bottom = 100 - (((pRect.top - cRect.top) + pRect.height) / cRect.height) * 100;
                    const right = 100 - (((pRect.left - cRect.left) + pRect.width) / cRect.width) * 100;

                    return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
                },
                borderRadius: 20,
                duration: 1,
                ease: "none"
            }
        );

        // Fade in text content
        tl.fromTo(contentRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.4 },
            0.3
        );

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-[#07070F] overflow-hidden flex flex-col items-center justify-center p-0 m-0"
        >
            {/* 1. Video Wrapper: Stays inside pinning container */}
            <div
                ref={videoWrapperRef}
                className="overflow-hidden pointer-events-none"
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

            {/* 2. Content Layer */}
            <div ref={contentRef} className="relative z-20 w-full max-w-[1475px] text-white flex flex-col items-center opacity-0 px-24">
                <h2 className="text-mega-h2 font-mega leading-[1.1] uppercase text-center mb-64 max-w-[1200px]">
                    BRING
                    <span
                        ref={placeholderRef}
                        className="inline-block w-[140px] md:w-[160px] h-[72px] md:h-[90px] align-middle mx-16 rounded-2xl invisible"
                    ></span>
                    YOUR PRODUCT<br />
                    TO MARKET <span className="text-brand">FASTER</span>
                </h2>

                <div className="flex flex-wrap gap-24 justify-center pointer-events-auto">
                    <Button size="large" className="gap-12 pl-24 pr-32">
                        <Calendar size={20} />
                        <span>Schedule a meeting</span>
                    </Button>
                    <Button variant="outline" size="large" className="text-white border-white/30 hover:border-white/60 hover:bg-white/5 gap-12 pl-24 pr-32">
                        <Mail size={20} />
                        <span>Email us</span>
                    </Button>
                    <Button variant="outline" size="large" className="text-white border-white/30 hover:border-white/60 hover:bg-white/5 gap-12 pl-24 pr-32">
                        <MessageSquare size={20} />
                        <span>WhatsApp</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}
