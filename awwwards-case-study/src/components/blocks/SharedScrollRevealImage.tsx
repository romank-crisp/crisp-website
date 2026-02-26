"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";
import { getAssetUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealImageProps {
    src: string;
    videoSrc?: string;
    alt: string;
    className?: string;
    aspectRatio?: string;
    mode?: "intrinsic" | "cover";
}

export function SharedScrollRevealImage({
    src,
    videoSrc,
    alt,
    className,
    aspectRatio,
    mode = "intrinsic"
}: ScrollRevealImageProps) {
    const resolvedSrc = getAssetUrl(src);
    const resolvedVideoSrc = videoSrc ? getAssetUrl(videoSrc) : undefined;
    const containerRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !mediaRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });

        tl.fromTo(containerRef.current,
            { clipPath: "inset(100% 0 0 0)" },
            {
                clipPath: "inset(0% 0 0 0)",
                duration: 1.2,
                ease: "power2.inOut",
                overwrite: "auto"
            }
        ).fromTo(mediaRef.current,
            { scale: 1.15 },
            {
                scale: 1,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            },
            0
        );

        if (videoRef.current) {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 60%",
                once: true,
                onEnter: () => videoRef.current?.play()
            });
        }

    }, { scope: containerRef });

    const isCover = mode === "cover";

    return (
        <div
            ref={containerRef}
            className={clsx(
                "relative w-full h-auto max-w-full overflow-hidden bg-gray-100 will-change-[clip-path]",
                isCover ? aspectRatio : "",
                className
            )
            }
        >
            <div ref={mediaRef} className={clsx("w-full will-change-transform", isCover ? "h-full" : "")}>
                {videoSrc ? (
                    <video
                        ref={videoRef}
                        src={resolvedVideoSrc}
                        poster={resolvedSrc}
                        muted
                        playsInline
                        className={clsx("w-full block cursor-pointer", isCover ? "h-full object-cover" : "h-auto")}
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                videoRef.current.play();
                            }
                        }}
                    />
                ) : (
                    isCover ? (
                        <Image
                            src={resolvedSrc}
                            alt={alt}
                            fill
                            sizes="100vw"
                            className="object-cover block"
                        />
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={resolvedSrc}
                            alt={alt}
                            className="block w-full h-auto"
                        />
                    )
                )}
            </div>
        </div>
    );
}
