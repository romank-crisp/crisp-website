"use client";

import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { motion, useMotionValue, useAnimationFrame, wrap, useInView } from "framer-motion";
import { InfiniteScrollItem, InfiniteScrollContentItem } from "@/types/work";
import Lottie from "lottie-react";

const DynamicLottie = memo(({ url, isVisible }: { url: string; isVisible: boolean }) => {
    const [data, setData] = useState<any>(null);
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        if (!url) return;
        fetch(url).then(r => r.json()).then(setData).catch(console.error);
    }, [url]);

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
    const hasCustomColor = item.color?.startsWith('#') || item.color?.startsWith('rgb') || item.color?.startsWith('hsl');
    const colorClass = hasCustomColor ? '' : item.color;

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play().catch(() => {
                    // Autoplay might be blocked until user interaction
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            id={item.id}
            className={`shrink-0 flex items-center justify-center overflow-hidden relative ${isPlaceholder ? '' : `rounded-[var(--corner-large)] shadow-sm ${isText ? 'bg-brand' : colorClass}`}`}
            style={{
                width: item.width,
                height: item.height,
                ...(!isPlaceholder && !isText && hasCustomColor ? { backgroundColor: item.color } : {}),
                willChange: "transform"
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
                                preload="metadata"
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
                                loading="lazy"
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
            ) : (
                <div className="p-32 h-full flex items-center justify-center text-center">
                    <p className="font-text text-text-lg text-white">{item.text}</p>
                </div>
            )}
            {!isText && (
                <span className="absolute bottom-6 right-6 font-heading text-sm font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-[16px] py-2 rounded-full z-10">
                    {item.label || `${item.width}x${item.height}`}
                </span>
            )}
        </div>
    );
});

ScrollItem.displayName = "ScrollItem";

export const ROWS_DATA: InfiniteScrollItem[][] = [
    // Fallback data if no JSON is available or structured correctly
    [
        { id: '1-1', type: "image", width: 800, height: 500, color: "bg-gray-200", label: "image-1", src: "/img/workspane/pane-01-cardblock.mp4" },
        { id: '1-2', type: "text", width: 700, height: 500, color: "bg-brand", label: "text-1", text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead." },
    ]
];

interface InfiniteScrollPaneProps {
    data?: InfiniteScrollContentItem[];
    id?: string;
}

export function InfiniteScrollPane({ data, id = "infinite-scroll" }: InfiniteScrollPaneProps) {
    const mappedData = useMemo(() => {
        if (!data || data.length === 0) return ROWS_DATA;

        // Group the incoming JSON items by their "row" field
        const rowsMap = new Map<number, any[]>();

        data.forEach((item) => {
            const rowNumber = item.row || 1;
            if (!rowsMap.has(rowNumber)) {
                rowsMap.set(rowNumber, []);
            }

            rowsMap.get(rowNumber)!.push({
                ...item,
                id: item.id || `item-${Math.random()}`,
                width: item.width || 600,
                height: item.height || 500,
            });
        });

        // Sort items per row based on "slot"
        const sortedRows = Array.from(rowsMap.keys()).sort((a, b) => a - b);
        const mappedRows = sortedRows.map(rowNum => {
            const items = rowsMap.get(rowNum)!;
            return items.sort((a, b) => (a.slot || 0) - (b.slot || 0));
        });

        return mappedRows.length > 0 ? mappedRows : ROWS_DATA;
    }, [data]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentDims, setContentDims] = useState({ width: 0, height: 0 });

    const isDragging = useRef(false);
    const velocity = useRef({ x: 0, y: 0 });
    const targetMultiplier = useRef({ x: 1, y: 0 }); // Default horizontal scroll only
    const currentMultiplier = useRef({ x: 1, y: 0 });

    // Add state for number of copies based on window width
    const [copies, setCopies] = useState(2);
    const initialized = useRef(false);

    useEffect(() => {
        const handleResize = () => {
            setCopies(window.innerWidth > 1900 ? 3 : 2);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    const fullLayout = useMemo(() => {
        return Array(copies).fill(mappedData).flat().map((row, rowIdx) => ({
            id: rowIdx,
            items: Array(copies).fill(row).flat()
        }));
    }, [mappedData, copies]);

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
                className="flex flex-col gap-4 md:gap-8 px-4 cursor-grab active:cursor-grabbing w-max items-start"
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
                {Array(copies).fill(mappedData).flat().map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-4 md:gap-8 flex-nowrap">
                        {Array(copies).fill(row).flat().map((item, idx) => (
                            <ScrollItem
                                key={idx}
                                item={{ ...item, id: `${rowIdx}-${idx}-${item.id}` }}
                            />
                        ))}
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
