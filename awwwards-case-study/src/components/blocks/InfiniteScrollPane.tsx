"use client";

import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { motion, useMotionValue, useAnimationFrame, wrap, useInView } from "framer-motion";
import { InfiniteScrollItem, InfiniteScrollContentItem } from "@/types/work";
import Lottie from "lottie-react";
import Spline from "@splinetool/react-spline";

const globalLottieCache = new Map<string, any>();

const DynamicLottie = memo(({ url, isVisible }: { url: string; isVisible: boolean }) => {
    const [data, setData] = useState<any>(globalLottieCache.get(url) || null);
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        if (!url || data) return;
        fetch(url)
            .then(r => r.json())
            .then(json => {
                globalLottieCache.set(url, json);
                setData(json);
            })
            .catch(console.error);
    }, [url, data]);

    useEffect(() => {
        if (lottieRef.current) {
            if (isVisible) {
                lottieRef.current.play();
            } else {
                lottieRef.current.pause();
            }
        }
    }, [isVisible]);

    if (!data) return null;
    return (
        <Lottie
            lottieRef={lottieRef}
            animationData={data}
            loop={true}
            autoplay={isVisible}
            className="w-full h-full"
        />
    );
});

DynamicLottie.displayName = "DynamicLottie";

export const ScrollItem = memo(({ item }: { item: InfiniteScrollItem }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Use a small amount of margin to start playing before it's fully visible
    const isVisible = useInView(containerRef, { margin: "20% 0px 20% 0px" });

    const isPlaceholder = item.type === "image" && !item.src;
    const isText = item.type === "text";
    const isSpline = item.type === "spline";
    const hasCustomColor = !isSpline && (item.color?.startsWith('#') || item.color?.startsWith('rgb') || item.color?.startsWith('hsl'));
    const colorClass = hasCustomColor ? '' : item.color;

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const w = parseInt(String(item.width).replace('px', ''), 10);
    const h = parseInt(String(item.height).replace('px', ''), 10);
    const currentWidth = isMobile && !isNaN(w) ? `${w * 0.7}px` : item.width;
    const currentHeight = isMobile && !isNaN(h) ? `${h * 0.7}px` : item.height;

    useEffect(() => {
        if (videoRef.current) {
            import('@/hooks/useSequentialVideo').then(({ SequentialVideoLoader }) => {
                const loader = SequentialVideoLoader.getInstance();

                if (isVisible) {
                    loader.enqueue(videoRef.current!);
                    videoRef.current!.play().catch(() => {
                        // Autoplay might be blocked until user interaction
                    });
                } else {
                    loader.dequeue(videoRef.current!);
                    videoRef.current!.pause();
                }
            });
        }
    }, [isVisible]);

    return (
        <div
            className="shrink-0 transition-all duration-300"
            style={{
                width: currentWidth,
                height: currentHeight,
                willChange: "transform"
            }}
        >
            <div
                ref={containerRef}
                id={item.id}
                className={`w-full h-full flex items-center justify-center overflow-hidden relative ${isPlaceholder ? '' : `rounded-[var(--corner-large)] shadow-sm ${isText ? 'bg-brand' : colorClass}`}`}
                style={{
                    ...(!isPlaceholder && !isText && hasCustomColor ? { backgroundColor: item.color } : {}),
                }}
            >
                {item.type === "image" ? (
                    <>
                        {item.src ? (
                            item.src.endsWith('.mp4') || item.src.endsWith('.webm') ? (
                                <video
                                    ref={videoRef}
                                    src={item.src}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : item.src.endsWith('.json') ? (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8">
                                    <DynamicLottie url={item.src} isVisible={isVisible} />
                                </div>
                            ) : (
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    loading="eager"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center">
                                <span className="font-heading text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">{item.label}</span>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 opacity-50">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                        )}
                    </>
                ) : item.type === "spline" ? (
                    // Spline 3D scene — uses exact same technique as HomeHorizontalMasonry
                    <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing [&>div]:!h-full [&>div]:!w-full [&>div>canvas]:!w-full [&>div>canvas]:!h-full [&>div>canvas]:object-cover">
                        <Spline scene={item.src || "/img/workspane/pane-11-viry/scene.splinecode"} />
                    </div>
                ) : (
                    <div className="p-8 md:p-32 h-full flex items-center justify-center text-center w-[70%] md:w-full mx-auto">
                        <p className="font-text text-text-lg text-white">{item.text}</p>
                    </div>
                )}
                {!isText && !isSpline && (
                    <span className="absolute bottom-6 right-6 font-heading text-sm font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-[16px] py-2 rounded-full z-10">
                        {item.label || `${item.width}x${item.height}`}
                    </span>
                )}
            </div>
        </div>
    );
});

ScrollItem.displayName = "ScrollItem";

interface InfiniteScrollPaneProps {
    items: InfiniteScrollItem[][];
    id?: string;
}

export function InfiniteScrollPane({ items, id = "infinite-scroll" }: InfiniteScrollPaneProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentDims, setContentDims] = useState({ width: 0, height: 0 });

    const isDragging = useRef(false);
    const velocity = useRef({ x: 0, y: 0 });
    const targetMultiplier = useRef({ x: 1, y: 0 }); // Default horizontal scroll only
    const currentMultiplier = useRef({ x: 1, y: 0 });

    const copies = 3;
    const initialized = useRef(false);

    useEffect(() => {
        const updateDims = () => {
            if (containerRef.current) {
                const width = containerRef.current.scrollWidth / copies;
                const height = containerRef.current.scrollHeight / copies;
                setContentDims({ width, height });

                if (!initialized.current && width > 0 && height > 0) {
                    x.set(-width / 2);
                    y.set(-height / 2);
                    initialized.current = true;
                }
            }
        };
        const timer = setTimeout(updateDims, 100);
        return () => clearTimeout(timer);
    }, [copies, x, y]);

    useAnimationFrame((t, delta) => {
        if (!contentDims.width || !contentDims.height) return;

        // Auto-scroll speed
        const autoSpeed = -0.7;
        const timeScale = Math.min(delta / 16.666, 2); // Cap delta to avoid jumps after tab blur

        if (!isDragging.current) {
            velocity.current.x *= Math.pow(0.95, timeScale);
            velocity.current.y *= Math.pow(0.95, timeScale);

            currentMultiplier.current.x += (targetMultiplier.current.x - currentMultiplier.current.x) * 0.1 * timeScale;
            currentMultiplier.current.y += (targetMultiplier.current.y - currentMultiplier.current.y) * 0.1 * timeScale;

            if (Math.abs(velocity.current.x) < 0.1) velocity.current.x = 0;
            if (Math.abs(velocity.current.y) < 0.1) velocity.current.y = 0;

            const moveX = (autoSpeed * currentMultiplier.current.x) + velocity.current.x;
            const moveY = (autoSpeed * currentMultiplier.current.y) + velocity.current.y;

            const newX = x.get() + moveX * timeScale;
            const newY = y.get() + moveY * timeScale;

            x.set(wrap(-contentDims.width, 0, newX));
            y.set(wrap(-contentDims.height, 0, newY));
        }
    });

    // Extract layout arrays once to avoid inline mapping during render
    // Extract layout arrays once to avoid inline mapping during render
    const fullLayout = useMemo(() => {
        if (!items || items.length === 0) return [];
        return Array(copies).fill(items).flat().map((row, rowIdx) => ({
            id: rowIdx,
            items: Array(copies).fill(row).flat()
        }));
    }, [items, copies]);

    return (
        <section
            id={id}
            className="relative w-full h-[150vh] min-h-[600px] bg-white overflow-hidden flex items-center justify-center select-none"
            onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                targetMultiplier.current = {
                    x: mouseX < rect.width / 2 ? -4.5 : 4.5,
                    y: mouseY < rect.height / 2 ? -4.5 : 4.5
                };
            }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                targetMultiplier.current = {
                    x: mouseX < rect.width / 2 ? -4.5 : 4.5,
                    y: mouseY < rect.height / 2 ? -4.5 : 4.5
                };
            }}
            onMouseLeave={() => {
                targetMultiplier.current = { x: 1, y: 0 };
            }}
        >
            <motion.div
                className="flex flex-col gap-[2px] md:gap-8 px-[2px] md:px-4 cursor-grab active:cursor-grabbing w-max items-start"
                ref={containerRef}
                style={{ x, y, willChange: "transform" }}
                onPanStart={() => {
                    isDragging.current = true;
                    velocity.current = { x: 0, y: 0 };
                }}
                onPan={(e, info) => {
                    velocity.current = { x: info.delta.x, y: info.delta.y };
                    if (contentDims.width && contentDims.height) {
                        x.set(wrap(-contentDims.width, 0, x.get() + info.delta.x));
                        y.set(wrap(-contentDims.height, 0, y.get() + info.delta.y));
                    }
                }}
                onPanEnd={(e, info) => {
                    isDragging.current = false;
                    velocity.current = {
                        x: info.velocity.x / 60,
                        y: info.velocity.y / 60
                    };
                }}
            >
                {fullLayout.map((row) => (
                    <div key={row.id} className="flex gap-[2px] md:gap-8 flex-nowrap">
                        {row.items.map((item, idx) => (
                            <ScrollItem
                                key={`${row.id}-${idx}`}
                                item={{ ...item, id: `${row.id}-${idx}-${item.id}` }}
                            />
                        ))}
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
