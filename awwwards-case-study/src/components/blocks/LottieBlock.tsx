"use client";

import { useRef, useState, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LottieBlockProps } from "@/types/case-study";
import { clsx } from "clsx";

gsap.registerPlugin(ScrollTrigger);

export function LottieBlock({
    animationPath,
    loop = false,
    aspectRatio = "aspect-[16/9]",
    className
}: LottieBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [animationData, setAnimationData] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    // Fetch the animation data
    useEffect(() => {
        let isMounted = true;
        fetch(animationPath)
            .then(res => res.json())
            .then(data => {
                if (isMounted) setAnimationData(data);
            })
            .catch(err => console.error(`Failed to load Lottie animation: ${animationPath}`, err));

        return () => { isMounted = false; };
    }, [animationPath]);

    const play = () => {
        if (lottieRef.current) {
            lottieRef.current.goToAndPlay(0, true);
        }
    };

    useGSAP(() => {
        if (!animationData || !containerRef.current || !isReady) return;

        // Initialize ScrollTrigger
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 85%",
            onEnter: () => play(),
            onEnterBack: () => play(),
        });

        // Trigger refresh and robust initial check
        const timeout = setTimeout(() => {
            if (containerRef.current && ScrollTrigger.isInViewport(containerRef.current)) {
                play();
            }
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            st.kill();
            clearTimeout(timeout);
        };
    }, [animationData, isReady]);

    return (
        <div
            ref={containerRef}
            className={clsx("w-full h-full flex items-center justify-center cursor-pointer", className)}
            onClick={play}
        >
            <div className={clsx("w-full h-full relative", aspectRatio)}>
                {animationData ? (
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={animationData}
                        loop={loop}
                        autoplay={false}
                        onDOMLoaded={() => setIsReady(true)}
                        className="w-full h-full pointer-events-none"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center aspect-[16/9]">
                        <div className="text-black/10 animate-pulse text-sm">Loading animation...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
