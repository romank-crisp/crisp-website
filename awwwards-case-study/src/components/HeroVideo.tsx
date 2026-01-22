"use client";

import React, { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

interface HeroVideoProps {
    title: string;
    subtitle: string;
    videoPath: string;
    posterPath: string;
    tags: string[];
    onPlayChange?: (isPlaying: boolean) => void;
}

export function HeroVideo({
    title,
    subtitle,
    videoPath,
    posterPath,
    tags,
    onPlayChange
}: HeroVideoProps) {
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
        onPlayChange?.(true);
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
        onPlayChange?.(false);
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

    return (
        <section
            ref={containerRef}
            data-cursor={isFullExperience ? "playing" : "video"}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
                <div ref={textRef} className="space-y-4 max-w-[1600px] mx-auto w-full">
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
                        className="text-[12vw] md:text-hero leading-[1.1] uppercase font-display tracking-[-3.268px] text-white"
                        style={{
                            WebkitTextStrokeWidth: '2px',
                            WebkitTextStrokeColor: '#FFF',
                        }}
                    >
                        {title}
                    </h1>

                    <p className="text-xl md:text-2xl font-light max-w-xxl mx-auto opacity-90 font-body">
                        {subtitle}
                    </p>
                </div>

                <button
                    ref={playRef}
                    className="mt-12 group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300"
                >
                    <span className="relative flex items-center justify-center w-10 h-10 bg-accent rounded-full text-white">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                    </span>
                    <span className="text-sm uppercase tracking-wider font-bold">Watch Reel</span>
                </button>
            </div>

            {/* Controls */}
            {isFullExperience && (
                <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-between px-12 pointer-events-none">
                    <div className="flex items-center gap-4 mx-auto pointer-events-auto">
                        <button
                            onClick={handleCloseExperience}
                            className="w-16 h-16 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 hover:bg-whiteGroup transition-all duration-500 group"
                        >
                            <Image
                                src="/img/icons/cross.svg"
                                alt="Close"
                                width={24}
                                height={24}
                                className="group-hover:rotate-90 transition-transform duration-500"
                            />
                        </button>
                    </div>

                    <button
                        onClick={toggleMute}
                        className="absolute right-12 bottom-0 w-16 h-16 flex items-center justify-center bg-black border border-white/10 rounded-full hover:scale-110 transition-all duration-500 pointer-events-auto group"
                    >
                        <Image
                            src={isMuted ? "/img/icons/volume-off.svg" : "/img/icons/volume.svg"}
                            alt="Toggle Sound"
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
            )}

            {/* Scroll Indicator */}
            <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-[1px] h-12 bg-white/50 mx-auto" />
                <p className="text-[10px] uppercase tracking-widest mt-2">Scroll</p>
            </div>
        </section>
    );
}
