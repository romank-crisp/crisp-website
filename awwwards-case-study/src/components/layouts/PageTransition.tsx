"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";

/**
 * PageTransition
 *
 * Handles seamless page transitions with a white wipe overlay:
 *   1. Exit:  white cover sweeps up from bottom (0.5s)
 *   2. Page swap happens behind the white cover
 *   3. Enter: white cover sweeps up and away to reveal new page (0.5s)
 */

const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");

    useEffect(() => {
        if (pathname === prevPathname.current) return;
        prevPathname.current = pathname;

        // Phase 1: white cover sweeps up
        setPhase("cover");

        // Phase 2: after cover animation completes, reveal new page
        const revealTimer = setTimeout(() => {
            setPhase("reveal");
        }, 550); // slightly longer than cover duration

        // Phase 3: reset to idle after reveal completes
        const idleTimer = setTimeout(() => {
            setPhase("idle");
        }, 1100);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(idleTimer);
        };
    }, [pathname]);

    return (
        <>
            {/* Page content — simple crossfade behind the white cover */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
                    }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.2, ease: "easeIn" },
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* White wipe overlay */}
            <motion.div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundColor: "#ffffff",
                    zIndex: 9000,
                    transformOrigin: phase === "cover" ? "bottom" : "top",
                }}
                animate={{
                    scaleY: phase === "cover" ? 1 : 0,
                }}
                transition={{
                    duration: 0.5,
                    ease: easing,
                }}
            />
        </>
    );
}
