"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { getAssetUrl } from "@/lib/utils";

const WORDS = ["DREAM", "PLAN", "CREATE"];
let BRAND_COLOR = "rgb(224, 12, 51)"; // will be overridden from CSS var

interface Sparkle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    decay: number;
}

function createSparkle(x: number, y: number): Sparkle {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.5 + 0.5;
    return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 2.5 + 1.5,
        opacity: 1,
        decay: Math.random() * 0.007 + 0.004,
    };
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
}

export function HomeAnimatedText() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparklesRef = useRef<Sparkle[]>([]);
    const rafRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobileRef = useRef(false);
    const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [animationRunning, setAnimationRunning] = useState(false);

    // Sync CSS animation with video play
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const startAnimation = () => setAnimationRunning(true);
        video.addEventListener("play", startAnimation);
        if (!video.paused) startAnimation();
        return () => video.removeEventListener("play", startAnimation);
    }, []);

    // Sparkle canvas loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Size canvas to container
        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        // Detect mobile
        isMobileRef.current = window.matchMedia("(pointer: coarse)").matches;

        // Read actual brand color from CSS variable
        const rawColor = getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim();
        if (rawColor) BRAND_COLOR = `rgb(${rawColor.replace(/\s+/g, ', ')})`;

        // Render loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            sparklesRef.current = sparklesRef.current.filter(s => s.opacity > 0);

            for (const s of sparklesRef.current) {
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.05; // gravity
                s.opacity -= s.decay;

                ctx.globalAlpha = Math.max(0, s.opacity);
                ctx.fillStyle = BRAND_COLOR;
                drawCircle(ctx, s.x, s.y, s.size);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        // Mobile: continuous random sparkle burst
        const spawnMobileBurst = () => {
            if (!canvas) return;
            const count = 6 + Math.floor(Math.random() * 6); // 2x qty
            for (let i = 0; i < count; i++) {
                sparklesRef.current.push(
                    createSparkle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height
                    )
                );
            }
        };

        if (isMobileRef.current) {
            loopIntervalRef.current = setInterval(spawnMobileBurst, 400);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
            if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
        };
    }, []);

    // Desktop: spawn sparkles on mouse move over container
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobileRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (Math.random() > 0.6) return; // less restrictive = more sparkles
        const count = 4 + Math.floor(Math.random() * 4); // 2x qty
        for (let i = 0; i < count; i++) {
            sparklesRef.current.push(createSparkle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20));
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-white overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Background Video */}
            <video
                ref={videoRef}
                src={getAssetUrl("/img/home-hero/home-hero-06.webm")}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
            />

            {/* Sparkle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />

            {/* Scoped animation CSS */}
            <style>{`
                .home-morph-container {
                    filter: url(#morph-home-threshold);
                    user-select: none;
                }
                .home-word-rotator {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 1.3em;
                }
                .home-morph-word {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    white-space: nowrap;
                    /* clamp prevents text going off canvas on mobile */
                    font-size: clamp(2rem, 15vw, calc(var(--fs-h1) * 3.5));
                    letter-spacing: -5px;
                    animation: home-rotate-words 9s infinite ease-in-out;
                    animation-play-state: paused;
                }
                .home-animation-running .home-morph-word {
                    animation-play-state: running;
                }
                .home-morph-word:nth-child(1) { animation-delay: 0s; }
                .home-morph-word:nth-child(2) { animation-delay: 3s; }
                .home-morph-word:nth-child(3) { animation-delay: 6s; }

                @keyframes home-rotate-words {
                    0%    { opacity: 0; filter: blur(20px); transform: translate(-50%, -50%) scale(0.8); }
                    5%    { opacity: 0.5; filter: blur(10px); }
                    15%, 35% { opacity: 1; filter: blur(0px); transform: translate(-50%, -50%) scale(1); }
                    45%   { opacity: 0.5; filter: blur(10px); }
                    50%, 100% { opacity: 0; filter: blur(20px); transform: translate(-50%, -50%) scale(1.2); }
                }
            `}</style>

            {/* SVG threshold filter */}
            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
                <defs>
                    <filter id="morph-home-threshold">
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 25 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* Morph text overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`home-morph-container w-full${animationRunning ? ' home-animation-running' : ''}`}>
                    <div className="home-word-rotator">
                        {WORDS.map((word, i) => (
                            <span
                                key={i}
                                className="home-morph-word font-heading uppercase font-bold text-brand"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
