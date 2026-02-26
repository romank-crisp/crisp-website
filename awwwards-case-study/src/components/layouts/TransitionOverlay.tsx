"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TransitionOverlay
 *
 * Lives in GlobalLayout, OUTSIDE of page content.
 * Listens to pathname changes and plays the 2-step wipe sequence:
 *   Phase 1 (out): grey wipe covers screen, then white covers grey
 *   Phase 2 (in):  white wipe slides up to reveal the new page
 *
 * The sequence is:
 *   navigate → grey sweeps up (0.6s) → white sweeps up (0.6s, delay 0.3s)
 *   → new page is shown under white → white sweeps away (0.8s)
 */
export function TransitionOverlay() {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (pathname === prevPathname.current) return;
        prevPathname.current = pathname;

        // Cancel any running timer
        if (timerRef.current) clearTimeout(timerRef.current);

        // Start: phase "out" — grey + white sweep up to cover screen
        setPhase("out");

        // After the OUT animation completes (grey 0.6s + white 0.3s delay + 0.6s = ~1.0s total)
        // we flip to phase "in" — white sweeps away to reveal the new page
        timerRef.current = setTimeout(() => {
            setPhase("in");

            // After the IN animation completes, reset to idle
            timerRef.current = setTimeout(() => {
                setPhase("idle");
            }, 1000); // duration of in animation
        }, 1100); // total duration of out phase

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname]);

    const isOut = phase === "out";
    const isIn = phase === "in";

    const easing: [number, number, number, number] = [0.95, 0.05, 0.05, 0.95];

    return (
        <>
            {/* Layer 1: Light Grey — sweeps up first on exit */}
            <motion.div
                className="fixed inset-0 pointer-events-none origin-bottom"
                style={{ backgroundColor: "rgb(220 220 220)", zIndex: 9000 }}
                animate={{ scaleY: isOut ? 1 : 0 }}
                transition={{
                    duration: 0.7,
                    ease: easing,
                    delay: isOut ? 0 : 0,
                }}
            />

            {/* Layer 2: White — sweeps up second, covers grey, stays for the reveal */}
            <motion.div
                className="fixed inset-0 pointer-events-none origin-bottom"
                style={{ backgroundColor: "white", zIndex: 9001 }}
                animate={{ scaleY: isOut || isIn ? 1 : 0 }}
                transition={{
                    duration: isOut ? 0.7 : 0,
                    ease: easing,
                    delay: isOut ? 0.35 : 0,
                }}
            />

            {/* Layer 3: White — covers from top and sweeps away to reveal new page */}
            <motion.div
                className="fixed inset-0 pointer-events-none origin-top"
                style={{ backgroundColor: "white", zIndex: 9002 }}
                animate={{ scaleY: isIn ? 0 : 0 }}
                initial={{ scaleY: 0 }}
                transition={{
                    duration: 1.0,
                    ease: easing,
                }}
            />
        </>
    );
}
