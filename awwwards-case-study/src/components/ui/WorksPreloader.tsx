"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

export function WorksPreloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        // Check if preloader has already been shown in this session (site-wide, not page-specific)
        const hasSeenPreloader = sessionStorage.getItem('hasSeenSitePreloader');
        if (hasSeenPreloader) {
            setIsLoading(false);
            return;
        }

        // Fetch animation data at runtime (file is served from GCS / public/)
        fetch('/img/preloader.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(() => {/* fail silently — preloader just won't animate */ });

        // Force the preloader to disappear after 3 seconds max
        const timer = setTimeout(() => {
            sessionStorage.setItem('hasSeenSitePreloader', 'true');
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Disable scrolling while preloader is visible
    useEffect(() => {
        if (!isLoading) {
            // Re-enable scrolling
            document.body.style.overflow = '';
            // Start lenis after preloader exit animation finishes
            setTimeout(() => {
                if ((window as any).lenis) {
                    (window as any).lenis.start();
                }
            }, 900); // slightly longer than exit animation (0.8s)
            return;
        }

        // Lock native scroll behind preloader
        document.body.style.overflow = 'hidden';

        // Lenis may not be initialised yet — poll until it is, then stop it
        const poll = setInterval(() => {
            if ((window as any).lenis) {
                (window as any).lenis.stop();
                clearInterval(poll);
            }
        }, 50);

        return () => {
            clearInterval(poll);
            document.body.style.overflow = '';
            if ((window as any).lenis) {
                (window as any).lenis.start();
            }
        };
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                >
                    <div className="w-96 h-96 md:w-[512px] md:h-[512px] flex items-center justify-center">
                        {animationData && (
                            <Lottie
                                animationData={animationData}
                                loop={true}
                                className="w-full h-full"
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
