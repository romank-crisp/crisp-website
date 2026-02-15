"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -100, y: -100 });
    const delayedMouse = useRef({ x: -100, y: -100 });
    const [cursorType, setCursorType] = useState<string | null>(null);
    const [isIdle, setIsIdle] = useState(false);
    const [isBigState, setIsBigState] = useState(false);
    const idleTimeout = useRef<NodeJS.Timeout | null>(null);

    const pathname = usePathname();
    const isSystemCursorRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/design-system");

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    useEffect(() => {
        if (isSystemCursorRoute || !cursorRef.current) return;

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

            // Update text content if available
            const customText = interactiveEl?.getAttribute('data-cursor-text');
            if (textRef.current && customText) {
                // Simple split by newline or just replace content. 
                textRef.current.innerHTML = customText.replace(/\\n/g, "<br/>");
            } else if (textRef.current && type === "video" && !customText) {
                // Fallback to default if video type but no text specified (backward compatibility)
                textRef.current.innerHTML = "<span>Play</span><span>Showreel</span>";
            }

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

            // Use ref directly to avoid reacting to state changes for position
            if (cursorRef.current) {
                gsap.set(cursorRef.current, { x: delayedMouse.current.x, y: delayedMouse.current.y });
            }
        };

        gsap.ticker.add(onTick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            gsap.ticker.remove(onTick);
            if (idleTimeout.current) clearTimeout(idleTimeout.current);
        };
    }, [isSystemCursorRoute]);

    // Logic for the big circle state with transition delay
    useEffect(() => {
        if (isSystemCursorRoute) return;

        let timeout: NodeJS.Timeout;

        if (cursorType === "video" && isIdle) {
            if (!isBigState) setIsBigState(true);
        } else if (!isIdle) {
            if (isBigState) {
                // Delay shrinking to prevent flickering
                timeout = setTimeout(() => {
                    setIsBigState(false);
                }, 1500);
            }
        } else {
            if (isBigState) setIsBigState(false);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        }
    }, [isIdle, cursorType, isBigState, isSystemCursorRoute]);

    // Use GSAP directly for visual states to avoid rapid React re-renders competing with DOM
    useEffect(() => {
        if (isSystemCursorRoute || !cursorRef.current || !textRef.current || !arrowRef.current) return;

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
            gsap.to(arrowRef.current, { opacity: 0, scale: 0, duration: 0.2 });
        } else if (cursorType === "arrow") {
            gsap.to(cursorRef.current, {
                width: 80,
                height: 80,
                backgroundColor: "white",
                mixBlendMode: "normal",
                duration: 0.4,
                overwrite: "auto",
                ease: "power3.out",
            });
            gsap.to(textRef.current, { opacity: 0, scale: 0, duration: 0.2 });
            gsap.to(arrowRef.current, {
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
            gsap.to(arrowRef.current, { opacity: 0, scale: 0, duration: 0.2 });
        }
    }, [isIdle, isBigState, cursorType, isSystemCursorRoute]);

    // Return null AFTER all hooks have been called
    if (isSystemCursorRoute) return null;

    return (
        <div
            ref={cursorRef}
            className="hidden md:flex fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden will-change-transform"
        >
            <div
                ref={textRef}
                className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-black opacity-0 scale-50 text-center leading-[1.2]"
            >
                <span>Play</span>
                <span>Showreel</span>
            </div>
            <div
                ref={arrowRef}
                className="absolute inset-0 flex items-center justify-center opacity-0 scale-0"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
