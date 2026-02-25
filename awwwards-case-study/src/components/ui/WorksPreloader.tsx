"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

import preloaderData from "../../../public/img/preloader.json";

export function WorksPreloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if preloader has already been shown in this session (site-wide, not page-specific)
        const hasSeenPreloader = sessionStorage.getItem('hasSeenSitePreloader');
        if (hasSeenPreloader) {
            setIsLoading(false);
            return;
        }

        // Force the preloader to disappear after 4 seconds max
        const timer = setTimeout(() => {
            sessionStorage.setItem('hasSeenSitePreloader', 'true');
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white"
                >
                    <div className="w-96 h-96 md:w-[512px] md:h-[512px] flex items-center justify-center">
                        {preloaderData && (
                            <Lottie
                                animationData={preloaderData}
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
