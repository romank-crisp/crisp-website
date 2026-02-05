"use client";

import { WorkCard } from "@/components/ui/WorkCard";
import { ClientLogos } from "@/components/blocks/ClientLogos";

const WORKS = [
    {
        title: "Folkeuniversitetet",
        tags: ["Branding", "Communication Materials", "Web Design"],
        image: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        video: "/img/imgcases/folkeuniversitetet/fu-showreel.mp4",
        poster: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        href: "/works/folkeuniversitetet"
    },
    {
        title: "CentroGreen",
        tags: ["Visual Identity", "Web Design", "Animation"],
        image: "/img/imgcases/centrogreen/cg-image-01.jpg",
        video: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        poster: "/img/imgcases/centrogreen/cg-image-01.jpg",
        href: "/works/centrogreen"
    },
    {
        title: "TheyTalk",
        tags: ["Platform", "Web Design", "Development"],
        image: "/img/imgcases/theytalk/theytalk-01.png",
        video: "/img/imgcases/theytalk/theytalk-full.webm",
        poster: "/img/imgcases/theytalk/theytalk-01.png",
        href: "/works/theytalk"
    },
    {
        title: "Content Engine",
        tags: ["Platform", "Web Design"],
        image: "/img/imgcases/content-engine/ce-01.png",
        video: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        poster: "/img/imgcases/content-engine/ce-01.png",
        href: "/works/content-engine"
    }
];


export default function WorksPage() {
    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-20 md:pb-32 bg-white text-black">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-[15vh]">
                {/* Header Section */}
                <section className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-x-8 items-end">
                    <h1 className="md:col-span-8 font-mega text-mega-h2 text-brand uppercase mb-8 md:mb-0">
                        Brands that<br />make your<br />product better
                    </h1>

                    <div className="md:col-span-4 md:col-start-9">
                        <p className="font-text text-base md:text-lg leading-relaxed">
                            In times like this, we bring over 50Y of team experience to make you brand
                        </p>
                    </div>
                </section>

                {/* Works Grid - 12 Columns */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20 md:mb-32">
                    {/* Card 1: Folkeuniversitetet - 6 columns */}
                    <div className="md:col-span-6">
                        <WorkCard {...WORKS[0]} />
                    </div>

                    {/* Card 2: TheyTalk - 5 columns in 8-12 range with spinner on left */}
                    <div className="md:col-span-5 md:col-start-8 relative">
                        <div className="relative w-full">
                            {/* Spinner - positioned on left, stacked on top */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[200px] h-[200px] z-10">
                                <img
                                    src="/img/spinner-crisp.svg"
                                    alt="Decoration"
                                    className="w-full h-full object-contain animate-spin"
                                    style={{ animationDuration: '8s' }}
                                />
                            </div>
                            {/* Card */}
                            <WorkCard {...WORKS[2]} />
                        </div>
                    </div>

                    {/* Card 3: CentroGreen - Full width with max height 75vh */}
                    <div className="md:col-span-12 max-h-[75vh]">
                        <WorkCard
                            {...WORKS[1]}
                            className="h-[75vh]"
                        />
                    </div>
                </section>

            </div>
            <ClientLogos />
        </main>
    );
}
