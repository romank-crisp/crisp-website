"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useAnimationFrame, wrap } from "framer-motion";
import { InfiniteScrollItem, InfiniteScrollContentItem } from "@/types/work";
import Lottie from "lottie-react";

function DynamicLottie({ url }: { url: string }) {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (!url) return;
        fetch(url).then(r => r.json()).then(setData).catch(console.error);
    }, [url]);

    if (!data) return null;
    return <Lottie animationData={data} loop={true} className="w-full h-full" />;
}

const ROWS_DATA: InfiniteScrollItem[][] = [
    // Row 1 - Height 500
    [
        { id: '1-1', type: "image", width: 800, height: 500, color: "bg-gray-200", label: "image-1", src: "/img/workspane/pane-01.mp4" },
        {
            id: '1-2', type: "text", width: 700, height: 500, color: "bg-brand", label: "text-1",
            text: "One dedicated team for copy, design, and marketing. Consistent monthly output with zero management overhead."
        },
        { id: '1-3', type: "image", width: 1000, height: 500, color: "bg-gray-300", label: "image-2", src: "/img/workspane/pane-02.jpg" },
        { id: '1-4', type: "image", width: 600, height: 500, color: "bg-gray-200", label: "image-3", src: "/img/workspane/pane-04.webm" },
        { id: '1-5', type: "image", width: 900, height: 500, color: "bg-red-50", label: "image-4", src: "/img/workspane/pane03.mp4" },
        { id: '1-6', type: "image", width: 800, height: 500, color: "bg-gray-100", label: "image-5", src: "/img/workspane/pane-01.mp4" },
    ],
    // Row 2 - Height 700
    [
        { id: '2-1', type: "image", width: 600, height: 700, color: "bg-blue-50", label: "image-6", src: "/img/workspane/pane-02.jpg" },
        { id: '2-2', type: "image", width: 1000, height: 700, color: "bg-gray-200", label: "image-7", src: "/img/workspane/pane-04.webm" },
        { id: '2-3', type: "image", width: 800, height: 700, color: "bg-gray-100", label: "image-8", src: "/img/workspane/pane03.mp4" },
        { id: '2-4', type: "image", width: 700, height: 700, color: "bg-brand/10", label: "image-9", src: "/img/workspane/pane-01.mp4" },
        { id: '2-5', type: "image", width: 800, height: 700, color: "bg-gray-300", label: "image-10", src: "/img/workspane/pane-02.jpg" },
        {
            id: '2-6', type: "text", width: 900, height: 700, color: "bg-brand", label: "text-2",
            text: "Fixed monthly scope. You define the goals; we handle end-to-end execution for a consistent, multi-channel presence."
        },
    ],
    // Row 3 - Height 560
    [
        { id: '3-1', type: "image", width: 900, height: 560, color: "bg-gray-300", label: "image-11", src: "/img/workspane/pane-04.webm" },
        { id: '3-2', type: "image", width: 800, height: 560, color: "bg-red-50", label: "image-12", src: "/img/workspane/pane03.mp4" },
        { id: '3-3', type: "image", width: 600, height: 560, color: "bg-gray-200", label: "image-13", src: "/img/workspane/pane-01.mp4" },
        { id: '3-4', type: "image", width: 1000, height: 560, color: "bg-gray-100", label: "image-14", src: "/img/workspane/pane-02.jpg" },
        {
            id: '3-5', type: "text", width: 700, height: 560, color: "bg-brand", label: "text-3",
            text: "Human expertise scaled by AI. Models accelerate research, while our team protects and refines your brand voice."
        },
        { id: '3-6', type: "image", width: 800, height: 560, color: "bg-gray-200", label: "image-16", src: "/img/workspane/pane03.mp4" },
    ]
];

interface InfiniteScrollPaneProps {
    data?: InfiniteScrollContentItem[];
}

export function InfiniteScrollPane({ data }: InfiniteScrollPaneProps) {
    const mappedData = useMemo(() => {
        if (!data || data.length === 0) return ROWS_DATA;

        let dataIndex = 0;
        return ROWS_DATA.map(row =>
            row.map(item => {
                const incomingItem = data[dataIndex % data.length];
                dataIndex++;

                return {
                    ...item,
                    type: incomingItem.type || item.type,
                    src: incomingItem.src !== undefined ? incomingItem.src : item.src,
                    text: incomingItem.text !== undefined ? incomingItem.text : item.text,
                    color: incomingItem.color !== undefined ? incomingItem.color : item.color,
                    label: incomingItem.label !== undefined ? incomingItem.label : item.label,
                    width: incomingItem.width !== undefined ? incomingItem.width : item.width,
                    // Height is explicitly omitted to ensure the layout matrix remains stable
                };
            })
        );
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
        const timeScale = delta / 16.666;

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

    return (
        <section
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
                style={{ x, y }}
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
                        {Array(copies).fill(row).flat().map((item, idx) => {
                            const isPlaceholder = item.type === "image" && !item.src;
                            const isText = item.type === "text";
                            const hasCustomColor = item.color?.startsWith('#') || item.color?.startsWith('rgb') || item.color?.startsWith('hsl');
                            const colorClass = hasCustomColor ? '' : item.color;

                            return (
                                <div
                                    key={idx}
                                    className={`shrink-0 flex items-center justify-center overflow-hidden relative ${isPlaceholder ? '' : `rounded-[var(--corner-large)] shadow-sm ${isText ? 'bg-brand' : colorClass}`}`}
                                    style={{
                                        width: item.width,
                                        height: item.height,
                                        ...(!isPlaceholder && !isText && hasCustomColor ? { backgroundColor: item.color } : {})
                                    }}
                                >
                                    {item.type === "image" ? (
                                        <>
                                            {item.src ? (
                                                item.src.endsWith('.mp4') || item.src.endsWith('.webm') ? (
                                                    <video
                                                        src={item.src}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                ) : item.src.endsWith('.json') ? (
                                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8">
                                                        <DynamicLottie url={item.src} />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item.src}
                                                        alt={item.label}
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
                                    <span className="absolute bottom-6 right-6 font-heading text-sm font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-[16px] py-2 rounded-full z-10">
                                        {item.label || `${item.width}x${item.height}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
