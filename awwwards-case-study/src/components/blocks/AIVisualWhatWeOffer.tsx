"use client";

import { useRef, useState, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAssetUrl } from "@/lib/utils";
import { WhatWeOfferData, WhatWeOfferCard } from "@/types/services-what-we-offer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ─── Lottie Media ─── */

function LottieMedia({ src }: { src: string }) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [animationData, setAnimationData] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetch(getAssetUrl(src))
            .then((r) => r.json())
            .then((d) => { if (mounted) setAnimationData(d); })
            .catch((e) => console.error("Lottie load failed:", e));
        return () => { mounted = false; };
    }, [src]);

    const play = () => lottieRef.current?.goToAndPlay(0, true);

    useGSAP(() => {
        if (!animationData || !containerRef.current || !isReady) return;

        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 80%",
            onEnter: () => play(),
            onEnterBack: () => play(),
        });

        const t = setTimeout(() => {
            if (containerRef.current && ScrollTrigger.isInViewport(containerRef.current)) play();
            ScrollTrigger.refresh();
        }, 500);

        return () => { st.kill(); clearTimeout(t); };
    }, [animationData, isReady]);

    return (
        <div ref={containerRef} className="w-full aspect-[847/463] rounded-[8px] overflow-hidden bg-gray-50 cursor-pointer" onClick={play}>
            {animationData ? (
                <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={false}
                    autoplay={false}
                    onDOMLoaded={() => setIsReady(true)}
                    className="w-full h-full pointer-events-none"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-black/10 animate-pulse text-sm">Loading…</div>
                </div>
            )}
        </div>
    );
}

/* ─── Video Media ─── */

function VideoMedia({ src }: { src: string }) {
    return (
        <div className="w-full aspect-[847/463] rounded-[8px] overflow-hidden bg-gray-50">
            <video
                src={getAssetUrl(src)}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    );
}

/* ─── Single Card ─── */

function WhatWeOfferCardItem({ card, index }: { card: WhatWeOfferCard; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!cardRef.current) return;

        gsap.from(cardRef.current, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: cardRef });

    const isMediaLeft = card.layout === "media-left";

    const media = card.mediaType === "lottie"
        ? <LottieMedia src={card.mediaSrc} />
        : <VideoMedia src={card.mediaSrc} />;

    const text = (
        <div className="flex flex-col justify-center gap-16">
            <h3 className="font-heading text-h1 text-brand">
                {card.title}
            </h3>
            <p className="font-text text-text-md text-text/70">
                {card.description}
            </p>
        </div>
    );

    return (
        <div
            ref={cardRef}
            className="grid grid-cols-1 md:grid-cols-11 items-center"
        >
            {isMediaLeft ? (
                <>
                    <div className="md:col-span-7">{media}</div>
                    <div className="md:col-span-3 md:col-start-9">{text}</div>
                </>
            ) : (
                <>
                    <div className="md:col-span-7 md:col-start-5 md:order-2">{media}</div>
                    <div className="md:col-span-3 md:order-1">{text}</div>
                </>
            )}
        </div>
    );
}

/* ─── Section ─── */

export interface AIVisualWhatWeOfferProps {
    data?: WhatWeOfferData;
}

export function AIVisualWhatWeOffer({ data }: AIVisualWhatWeOfferProps) {
    if (!data) return null;

    return (
        <section className="relative w-full bg-white py-64 md:py-128">
            <div className="max-w-[1475px] mx-auto px-6 md:px-16">
                {/* Section Title */}
                <h2 className="font-mega text-mega-h2 uppercase text-text mb-48 md:mb-64">
                    {data.sectionTitle}
                </h2>

                {/* Cards */}
                <div className="flex flex-col gap-48 md:gap-128">
                    {data.cards.map((card, i) => (
                        <WhatWeOfferCardItem key={card.id} card={card} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
