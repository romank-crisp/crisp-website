"use client";

import { useState } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { Navbar } from "@/components/Navbar";

export default function FolkeuniversitetetPage() {
    const [isHeroPlaying, setIsHeroPlaying] = useState(false);

    return (
        <main className="min-h-screen bg-white">
            <Navbar isHidden={isHeroPlaying} />

            <HeroVideo
                title="Folkeuniversitetet"
                subtitle="Empowering education through digital transformation"
                videoPath="/img/imgcases/centrogreen/centrogreen-reel.webm" // Placeholder
                posterPath="/img/imgcases/centrogreen/cg-image-01.jpg" // Placeholder
                tags={["Digital Strategy", "Brand Identity", "Platform Design"]}
                onPlayChange={setIsHeroPlaying}
            />

            <section className="flex items-center justify-center py-40">
                <p className="text-large text-grey uppercase tracking-widest">Case Study Coming Soon</p>
            </section>
        </main>
    );
}
