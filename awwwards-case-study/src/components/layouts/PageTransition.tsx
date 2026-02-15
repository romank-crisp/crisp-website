"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
        setWindowWidth(window.innerWidth);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname}>

                {/* Content Wrapper - Fades in/out slightly to smooth the transition */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }} // Keep opacity 1 during exit so overlays cover it
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>

                {/* --- EXIT ANIMATION OVERLAYS --- */}

                {/* Layer 1: Light Grey - Wipes UP first */}
                <motion.div
                    className="fixed inset-0 z-40 pointer-events-none origin-bottom"
                    style={{ backgroundColor: "rgb(240 240 240)" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
                />

                {/* Layer 2: White - Wipes UP second, covering the dark layer */}
                <motion.div
                    className="fixed inset-0 z-40 pointer-events-none origin-bottom"
                    /* z-40 is same as dark, but since it's later in DOM it renders on top. 
                       If needed, use z-41, but let's be safe with z-indexes relative to Nav (z-50). */
                    style={{ backgroundColor: "rgb(var(--color-white))", zIndex: 41 }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.85, 0, 0.15, 1] }}
                />

                {/* --- ENTER ANIMATION OVERLAY --- */}

                {/* Layer 3: White - Starts Full, Wipes UP to reveal new page */}
                {/* This creates the illusion that the White layer from Exit continues moving up */}
                <motion.div
                    className="fixed inset-0 z-41 pointer-events-none origin-top"
                    style={{ backgroundColor: "rgb(var(--color-white))" }}
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                />

            </motion.div>
        </AnimatePresence>
    );
}
