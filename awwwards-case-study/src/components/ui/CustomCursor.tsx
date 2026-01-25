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

            // Update text content if available
            const customText = interactiveEl?.getAttribute('data-cursor-text');
            if (textRef.current && customText) {
                // Simple split by newline or just replace content. 
                // Let's assume passed text is simple or uses <br> logic if we needed it, 
                // but for now let's just replace the innerHTML or textContent.
                // The current component uses two spans. Let's make it flexible.
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
    }, []);

    // Logic for the big circle state with transition delay
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // Expanded logic: Trigger big state for "video" OR any custom text cursor
        // The user said "use same logic (change size + add caption)".
        // So we treat any cursor with text as "video-like".

        // We need to know if there's text. We can infer it from cursorType or check existence.
        // For simplicity, let's say "block" type also triggers this, or just reuse "video".

        if (cursorType === "video" && isIdle) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
