"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Tag } from "./Tag";

interface WorkCardProps {
    title: string;
    tags: string[];
    image?: string;
    video?: string;
    poster?: string;
    href: string;
    className?: string;
    decoration?: {
        type: 'spinner';
        src: string;
        position?: 'bottom' | 'top';
    };
}

export function WorkCard({ title, tags, image, video, poster, href, className = "", decoration }: WorkCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isVisible = useInView(containerRef, { margin: "20% 0px 20% 0px" });

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current && isVisible) {
            videoRef.current.play();
        }
    };

    // Play the video when it comes into view, as long as it isn't being hovered
    useEffect(() => {
        if (videoRef.current) {
            import('@/hooks/useSequentialVideo').then(({ SequentialVideoLoader }) => {
                const loader = SequentialVideoLoader.getInstance();

                if (isVisible && !isHovered) {
                    loader.enqueue(videoRef.current!);
                    videoRef.current!.play().catch(() => { });
                } else if (!isVisible) {
                    loader.dequeue(videoRef.current!);
                    videoRef.current!.pause();
                }
            });
        }
    }, [isVisible, isHovered]);

    return (
        <Link
            ref={containerRef}
            href={href}
            className={`group relative block w-full aspect-[4/5] overflow-hidden bg-gray-100 rounded-[var(--corner-large)] ${className}`}
            data-cursor="arrow"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Video or Image */}
            <div className="absolute inset-0 w-full h-full">
                {video ? (
                    <video
                        ref={videoRef}
                        src={video}
                        poster={poster || image}
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                )}
            </div>

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

            {/* Decoration/Spinner Overlay */}
            {decoration && decoration.type === 'spinner' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]">
                    <img
                        src={decoration.src}
                        alt="Decoration"
                        className="w-full h-full object-contain animate-spin"
                        style={{ animationDuration: '8s' }}
                    />
                </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-0 p-[64px] flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                {/* Arrow Icon Top Right */}
                <div className="absolute top-[64px] right-[64px] text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
                        <path d="M7 17L17 7M7 7H17M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Title - DM Sans Bold with staggered animation */}
                <h3 className="font-text text-3xl md:text-5xl text-white mb-6 font-bold leading-[1.14] transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-100">
                    {title}
                </h3>

                {/* Tags with staggered animation */}
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <Tag
                            key={i}
                            variant="default"
                            className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                            style={{ transitionDelay: `${200 + i * 75}ms` }}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            </div>
        </Link>
    );
}
