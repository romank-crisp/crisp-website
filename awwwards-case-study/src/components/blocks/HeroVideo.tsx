"use client";

import React, { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

import { HeroVideoProps } from "@/types/case-study";

import { useContactForm } from "@/context/ContactFormContext";

export function HeroVideo({
    title,
    subtitle,
    videoPath,
    posterPath,
    tags
}: Omit<HeroVideoProps, "onPlayChange">) {
    const { setIsNavHidden } = useContactForm();
    const [isFullExperience, setIsFullExperience] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const playRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(containerRef.current, {
            clipPath: "inset(100% 0 0 0)",
            duration: 1.5,
        })
            .from(
                textRef.current!.children,
                {
                    y: 100,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 1,
                },
                "-=0.5"
            )
            .from(
                playRef.current,
                {
                    scale: 0,
                    opacity: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                },
                "-=0.8"
            );
    }, { scope: containerRef });

    const handleStartExperience = () => {
        setIsFullExperience(true);
        setIsNavHidden(true);
        setIsMuted(false);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = false;
            videoRef.current.play();
        }

        // Animate out elements
        gsap.to([textRef.current, playRef.current, scrollRef.current], {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.inOut",
            pointerEvents: "none"
        });
    };

    const handleCloseExperience = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFullExperience(false);
        setIsNavHidden(false);
        setIsMuted(true);
        if (videoRef.current) {
            videoRef.current.muted = true;
        }

        // Animate in original elements
        gsap.to([textRef.current, playRef.current, scrollRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            pointerEvents: "auto",
            delay: 0.2
        });
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    };

    const [isCursorInActiveZone, setIsCursorInActiveZone] = useState(false);

    useGSAP(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const yOffset = e.clientY / window.innerHeight;
            if (yOffset > 0.2 && yOffset < 0.8) {
                if (!isCursorInActiveZone) setIsCursorInActiveZone(true);
            } else {
                if (isCursorInActiveZone) setIsCursorInActiveZone(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isCursorInActiveZone]);

    return (
        <section
            ref={containerRef}
            data-cursor={isFullExperience ? "playing" : (isCursorInActiveZone ? "video" : null)}
            className="relative h-screen w-full overflow-hidden bg-black text-white cursor-none"
            onClick={!isFullExperience ? handleStartExperience : undefined}
        >
            {/* Background Video */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{ opacity: isFullExperience ? 1 : 0.8 }}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                poster={posterPath}
            >
                <source src={videoPath} type="video/webm" />
            </video>

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-black/30 transition-opacity duration-1000 ${isFullExperience ? 'opacity-0' : 'opacity-100'}`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
                <div ref={textRef} className="space-y-4 max-w-[1475px] mx-auto w-full">
                    <div className="flex items-center justify-center gap-4 text-sm md:text-base uppercase tracking-widest font-medium opacity-90">
                        {tags.map((tag, index) => (
                            <React.Fragment key={tag}>
                                <span>{tag}</span>
                                {index < tags.length - 1 && (
                                    <span className="w-1 h-1 bg-accent rounded-full" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <h1
                        className="text-mega-h1 leading-none uppercase font-mega text-white"
                        style={{
                            WebkitTextStrokeWidth: '4px',
                            WebkitTextStrokeColor: 'currentColor',
                        }}
                    >
                        {title}
                    </h1>

                    <p className="font-text text-md font-light max-w-xxl mx-auto opacity-90">
                        {subtitle}
                    </p>
                </div>

            </div>

            {/* Controls */}
            {
                isFullExperience && (
                    <div className="absolute bottom-48 left-0 right-0 z-20 flex justify-between px-24 md:px-48 pointer-events-none">
                        <div className="flex items-center mx-auto pointer-events-auto">
                            <button
                                onClick={handleCloseExperience}
                                className="w-64 h-64 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 hover:bg-neutral-900 transition-all duration-500 group shadow-2xl"
                            >
                                <Image
                                    src="/img/icons/cross.svg"
                                    alt="Close"
                                    width={20}
                                    height={20}
                                    className="group-hover:rotate-90 transition-transform duration-500"
                                />
                            </button>
                        </div>

                        <button
                            onClick={toggleMute}
                            className="absolute right-24 md:right-48 bottom-0 w-64 h-64 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 hover:bg-neutral-900 transition-all duration-500 pointer-events-auto group shadow-2xl"
                        >
                            <Image
                                src={isMuted ? "/img/icons/volume-off.svg" : "/img/icons/volume.svg"}
                                alt="Toggle Sound"
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>
                )
            }

            {/* Scroll Indicator */}
            <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-[1px] h-12 bg-white/50 mx-auto" />
                <p className="text-[10px] uppercase tracking-widest mt-2">Scroll</p>
            </div>
        </section >
    );
}
