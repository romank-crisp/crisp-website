"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -100, y: -100 });
    const delayedMouse = useRef({ x: -100, y: -100 });
    const [cursorType, setCursorType] = useState<string | null>(null);
    const [isIdle, setIsIdle] = useState(false);
    const [isBigState, setIsBigState] = useState(false);
    const idleTimeout = useRef<NodeJS.Timeout | null>(null);
    const shrinkTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!cursorRef.current) return;

        // Use quickSetter for high-performance updates
        const xSetter = gsap.quickSetter(cursorRef.current, "x", "px");
        const ySetter = gsap.quickSetter(cursorRef.current, "y", "px");

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };

            const target = e.target as HTMLElement;
            const interactiveEl = target.closest('[data-cursor]');
            const type = interactiveEl?.getAttribute('data-cursor') || null;

            // Only update state if type actually changed to avoid re-renders
            setCursorType(prev => prev !== type ? type : prev);

            setIsIdle(false);
            if (idleTimeout.current) clearTimeout(idleTimeout.current);
            idleTimeout.current = setTimeout(() => {
                setIsIdle(true);
            }, 250);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const onTick = () => {
            const dt = 0.15;
            delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * dt;
            delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * dt;

            xSetter(delayedMouse.current.x);
            ySetter(delayedMouse.current.y);
        };

        gsap.ticker.add(onTick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            gsap.ticker.remove(onTick);
            if (idleTimeout.current) clearTimeout(idleTimeout.current);
            if (shrinkTimeout.current) clearTimeout(shrinkTimeout.current);
        };
    }, []);

    // Logic for the big circle state with transition delay
    useEffect(() => {
        if (cursorType === "video" && isIdle) {
            if (shrinkTimeout.current) {
                clearTimeout(shrinkTimeout.current);
                shrinkTimeout.current = null;
            }
            setIsBigState(true);
        } else if (!isIdle) {
            if (isBigState && !shrinkTimeout.current) {
                shrinkTimeout.current = setTimeout(() => {
                    setIsBigState(false);
                    shrinkTimeout.current = null;
                }, 1500);
            }
        } else {
            if (shrinkTimeout.current) {
                clearTimeout(shrinkTimeout.current);
                shrinkTimeout.current = null;
            }
            setIsBigState(false);
        }
    }, [isIdle, cursorType, isBigState]);

    // Use GSAP directly for visual states to avoid rapid React re-renders competing with DOM
    useEffect(() => {
        if (!cursorRef.current || !textRef.current) return;

        if (isBigState) {
            gsap.to(cursorRef.current, {
                width: 140,
                height: 140,
                backgroundColor: "white",
                mixBlendMode: "normal",
                duration: 0.6,
                overwrite: "auto",
                ease: "power3.out",
            });
            gsap.to(textRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                delay: 0.1,
                overwrite: "auto"
            });
        } else {
            const size = isIdle ? 6 : 12;
            gsap.to(cursorRef.current, {
                width: size,
                height: size,
                backgroundColor: "white",
                mixBlendMode: "difference",
                duration: 0.3,
                overwrite: "auto",
                ease: "power2.out",
            });
            gsap.to(textRef.current, {
                opacity: 0,
                scale: 0.5,
                duration: 0.2,
                overwrite: "auto"
            });
        }
    }, [isIdle, isBigState]);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden will-change-transform"
        >
            <div
                ref={textRef}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-black opacity-0 scale-50 text-center leading-[1.2] flex flex-col items-center justify-center"
            >
                <span>Play</span>
                <span>Showreel</span>
            </div>
        </div>
    );
}
