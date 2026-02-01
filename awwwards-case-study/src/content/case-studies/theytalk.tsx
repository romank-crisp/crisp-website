import { CaseStudyContent } from "@/types/case-study";

const deliverables = [
    {
        title: "Logo Design",
        text: "We positioned TheyTalk as an AI layer that turns influencer marketing from guesswork into a focused, performance-driven channel."
    },
    {
        title: "Bold Visual Identity",
        text: "We created a new logo and visual system using a high-contrast green–black palette and confident layouts that instantly read as tech-forward, creative, and social."
    },
    {
        title: "Designed a flexible visual communication system",
        text: "We combined logo, color, type and graphic elements into a compact visual platform that can stretch across product UI, web presence, pitch decks, and social content."
    },
    {
        title: "UX/UI concepts for platform",
        text: "We designed UX and UI for the key platform pages, defining the initial user flow together with the founders and bringing the new look and feel directly into the product."
    },
    {
        title: "Delivered usable guidelines, not just pretty screens",
        text: "We handed over mini-guidelines and a clear structure for typography, color and component usage, so the start-up team can grow the system without breaking it."
    }
];

export const caseStudyTheyTalk: CaseStudyContent = {
    slug: "theytalk",
    meta: {
        title: "TheyTalk - Case Study",
        description: "TheyTalk – Influencer marketing with a brain.",
    },
    hero: {
        title: "TheyTalk",
        subtitle: "AI-native influencer marketing platform",
        videoPath: "/img/imgcases/theytalk/theytalk-full.webm",
        posterPath: "/img/imgcases/theytalk/theytalk-01.png",
        tags: ["Logo", "Brand Identity", "UX/UIConcept"],
    },
    blocks: [
        {
            type: "text-reveal",
            id: "intro-text",
            props: {
                text: "Founders needed a brand that could explain AI-driven matching in seconds, make founders look credible in front of investors, but same time feel native to the bright world of influencers.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "image-scroll",
            id: "they-talk-video-01",
            props: {
                src: "/img/imgcases/theytalk/they-talk-01.png",
                videoSrc: "/img/imgcases/theytalk/they-talk-01.webm",
                alt: "TheyTalk Presentation Video",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-grid-hover",
            id: "logo-grid-showcase",
            props: {
                heroSrc: "/img/imgcases/theytalk/tt-logo-grid-main.png",
                gridSrcs: [
                    "/img/imgcases/theytalk/tt-logo-grid01.jpg",
                    "/img/imgcases/theytalk/tt-logo-grid02.jpg",
                    "/img/imgcases/theytalk/tt-logo-grid03.png",
                    "/img/imgcases/theytalk/tt-logo-grid04.png",
                ],
                alt: "TheyTalk Logo Grid Concepts",
            },
        },
        {
            type: "theytalk-design-system",
            id: "color-palette",
            props: {}
        },
        {
            type: "image-scroll",
            id: "brand-visual-08",
            props: {
                src: "/img/imgcases/theytalk/theytalk-08.png",
                alt: "TheyTalk Design Elements",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "lottie",
            id: "typo-animation-01",
            props: {
                animationPath: "/img/imgcases/theytalk/they-talk-typo1.json",
                loop: false,
                autoplay: false,
                aspectRatio: "aspect-[16/9]"
            }
        },
        {
            type: "lottie",
            id: "typo-animation-02",
            props: {
                animationPath: "/img/imgcases/theytalk/they-talk-typo2.json",
                loop: false,
                autoplay: false,
                aspectRatio: "aspect-[16/9]"
            }
        },
        {
            type: "theytalk-influencer",
            id: "influencer-showcase",
            props: {
                videoSrc: "/img/imgcases/theytalk/tt-influencer-01.webm",
                overlayImageSrc: "/img/imgcases/theytalk/tt-voices-impact.svg",
                logoSrc: "/img/imgcases/theytalk/tt-logo-top.svg",
                aspectRatio: "aspect-[16/9]"
            }
        },
        {
            type: "image-scroll",
            id: "brand-visual-01",
            props: {
                src: "/img/imgcases/theytalk/theytalk-01.png",
                alt: "TheyTalk Brand Visual 01",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "text-reveal",
            id: "strategy-text",
            props: {
                text: "We positioned TheyTalk as an AI layer that turns influencer marketing from guesswork into a focused, performance-driven channel. The visual system uses a high-contrast green–black palette and confident layouts that instantly read as tech-forward.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "grid-2-col",
            id: "brand-grid-v1",
            props: {
                left: {
                    src: "/img/imgcases/theytalk/theytalk-02.png",
                    alt: "TheyTalk Brand Visual 02",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/theytalk/theytalk-03.png",
                    alt: "TheyTalk Brand Visual 03",
                    aspectRatio: "aspect-square",
                }
            }
        },
        {
            type: "image-scroll",
            id: "brand-visual-09",
            props: {
                src: "/img/imgcases/theytalk/theytalk-09.png",
                alt: "TheyTalk Brand Visual 09",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-04",
            props: {
                src: "/img/imgcases/theytalk/theytalk-04.png",
                alt: "TheyTalk Brand Visual 04",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "grid-2-col",
            id: "brand-grid-v2",
            props: {
                left: {
                    src: "/img/imgcases/theytalk/theytalk-05.png",
                    alt: "TheyTalk Brand Visual 05",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/theytalk/theytalk-05.png", // Fallback poster
                    videoSrc: "/img/imgcases/theytalk/tt-video-11.webm",
                    alt: "TheyTalk Video 11",
                    aspectRatio: "aspect-square",
                }
            }
        },
    ],
    details: {
        intro: "Influencer marketing is booming, but most teams still run it like a messy side project. Too many profiles, too little signal, and a lot of money wasted on “reach” that does not convert.",
        sections: [
            {
                title: "The Problem: Influencer Chaos",
                content: (
                    <p className="font-text text-text-md">
                        Influencer marketing is growing fast, but for many companies it is still chaotic, time-consuming, and hard to measure. TheyTalk needed a brand and product presence that clearly explained the value of AI-driven matching, built trust with investors and partners, and felt native to the social media world influencers live in.
                    </p>
                ),
            },
            {
                title: "The Challenge: Big Ambition, Start-Up Reality",
                content: (
                    <div className="space-y-24">
                        <p className="font-text text-text-md">
                            The founders wanted a strong, expressive identity and a demo-ready platform to pitch to investors—on a tight budget and an even tighter deadline.
                        </p>
                        <p className="font-text text-text-md">
                            We had to create something that speaks to two very different audiences at once: influencers who live in a visual, social space, and business decision-makers who care about clarity and ROI.
                        </p>
                    </div>
                ),
            },
            {
                title: "What We Did",
                content: (
                    <div className="flex flex-col">
                        {deliverables.map((item, index) => (
                            <div key={index} className="flex gap-10 items-start py-20 border-t border-text/10 first:border-t-0">
                                <p className="font-heading text-h2 font-bold leading-none w-[60px] md:w-[80px] shrink-0">
                                    {String(index + 1).padStart(2, '0')}
                                </p>
                                <div className="flex flex-col gap-[10px]">
                                    <h3 className="font-heading text-h3 font-bold leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="font-text text-text-md text-text/80">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                title: "How We Used AI (And How We Did Not)",
                content: (
                    <div className="space-y-24">
                        <p className="font-text text-text-md">
                            AI helped with research, visual exploration and generating supporting media assets, especially for speed and volume.
                        </p>
                        <p className="font-text text-text-md">
                            The actual identity, art direction and UX decisions came from the design team; AI acted as a production helper, not a creative director.
                        </p>
                    </div>
                ),
            },
            {
                title: "The Result",
                content: (
                    <div className="space-y-24">
                        <p className="font-text text-text-md">
                            TheyTalk now has a bright, unapologetic visual identity and a set of platform screens that tell the story in seconds: this is influencer marketing with a brain.
                        </p>
                        <p className="font-text text-text-md">
                            The logo and design system give the founders a recognisable face for the product in investor rooms and early sales conversations. The project proves that even under start-up constraints, you can build a brand that feels fast, ambitious and ready to scale.
                        </p>
                    </div>
                ),
            },
        ],
        sidebar: [
            { label: "Year", value: "2024" },
            { label: "CLIENT / LOCATION", value: "TheyTalk (London / Global)" },
            {
                label: "INDUSTRY",
                value: (
                    <>
                        <p>AdTech</p>
                        <p>Influencer Marketing</p>
                    </>
                ),
            },
            {
                label: "DELIVERABLES",
                value: (
                    <>
                        <p>Brand Identity</p>
                        <p>UX/UI Concept</p>
                        <p>Brand Visual Language</p>
                    </>
                ),
            },
            {
                label: "AI-ASSISTED WORKFLOWS",
                isRed: true,
                value: (
                    <>
                        <p>Research & Asset Production</p>
                        <p>Visual Exploration</p>
                        <p>Brand Media</p>
                    </>
                ),
            },
        ],
    },
    stats: {
        stats: [
            { value: "2W", label: "Brand creation in fast-track" },
            { value: "100%", label: "AI assisted video creation" },
            { value: "3", label: "Key UI screens" },
            { value: "1", label: "Cohesive System" },
        ],
    },
    nextCase: {
        title: "CentroGreen",
        subtitle: "Sustainable Infrastructure",
        link: "/works/centrogreen",
        videoPath: "/img/imgcases/centrogreen/centrogreen-reel.webm",
    }
};
