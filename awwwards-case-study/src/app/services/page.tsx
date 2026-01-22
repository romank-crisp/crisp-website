"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function ServicesPage() {
    const [isHeroPlaying, setIsHeroPlaying] = useState(false);

    return (
        <main className="min-h-screen bg-white">
            <Navbar isHidden={isHeroPlaying} />

            <section className="h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
                <h1 className="text-hero uppercase font-display">Services</h1>
                <p className="mt-8 text-xl md:text-2xl font-light opacity-70">Coming Soon</p>
            </section>
        </main>
    );
}
