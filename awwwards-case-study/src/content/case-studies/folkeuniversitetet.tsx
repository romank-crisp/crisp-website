import { CaseStudyContent } from "@/types/case-study";

const deliverables = [
    {
        title: "Kept the heritage, changed the lens",
        text: "We kept the owl and core colour palette, and built a new visual language around them that feels friendly, open, smart and accessible rather than institutional."
    },
    {
        title: "Merged two worlds into one mark",
        text: "We merged the historic owl symbol with a speech-bubble form inspired by Lingu, creating a logo that speaks to both education and conversation, past and present."
    },
    {
        title: "Designed a custom expressive type layer",
        text: "Using generative AI as a sketch engine, we explored many character shapes, then redrew and refined them into a custom “sketchy” display font for bold, memorable headlines."
    },
    {
        title: "Redesigned the website and platform",
        text: "We applied the new identity to the website and platform, aligning layouts, components and interactions so the experience feels like one coherent, modern learning environment."
    },
    {
        title: "Delivered tools, not just files",
        text: "We created a logo system, full identity, visual guidelines, mini brand book and header styles, giving the marketing team a practical toolkit for campaigns and everyday communication."
    },
    {
        title: "Added an AI-powered mascot for campaigns",
        text: "We introduced a character mascot, generated, refined and animated with AI, that now lives in digital ads and touchpoints, adding a human, playful note without diluting the core brand."
    },
    {
        title: "Rolled out across real-world assets",
        text: "We continue to support applications such as diplomas and office branding, ensuring the new identity holds up not only on screens, but in classrooms, ceremonies and public spaces."
    }
];

export const caseStudyFolkeuniversitetet: CaseStudyContent = {
    slug: "folkeuniversitetet",
    meta: {
        title: "Folkeuniversitetet - Case Study",
        description: "Empowering education through digital transformation",
    },
    hero: {
        title: "Folkeuniversitetet",
        subtitle: "Empowering education through digital transformation",
        videoPath: "/img/imgcases/folkeuniversitetet/fu-showreel.mp4",
        posterPath: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
        tags: ["Digital Strategy", "Brand Identity", "Platform Design"],
    },
    blocks: [
        {
            type: "text-reveal",
            id: "intro-text",
            props: {
                text: "Folkeuniversitetet is Norway's largest organizer of adult education. We helped them redefine their digital presence, creating a unified platform that makes lifelong learning accessible, intuitive, and inspiring for everyone.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "image-grid-hover",
            id: "fu-logo-showcase",
            props: {
                heroSrc: "/img/imgcases/folkeuniversitetet/fu-logo-main.png",
                gridSrcs: [
                    "/img/imgcases/folkeuniversitetet/ff-logo-01.png",
                    "/img/imgcases/folkeuniversitetet/ff-logo-02.png",
                    "/img/imgcases/folkeuniversitetet/ff-logo-03.png",
                    "/img/imgcases/folkeuniversitetet/ff-logo-04.png",
                ],
                alt: "Folkeuniversitetet Logo System",
            },
        },
        {
            type: "lottie",
            id: "fu-typo",
            props: {
                animationPath: "/img/imgcases/folkeuniversitetet/fu-typo.json",
                loop: true,
                autoplay: true,
                aspectRatio: "aspect-[16/9]"
            }
        },
        {
            type: "folkeuniversitet-design-system",
            id: "fu-design-system",
            props: {}
        },
        {
            type: "image-scroll",
            id: "fu-visual-01",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-01.png",
                alt: "Folkeuniversitetet Brand Overview",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "text-reveal",
            id: "intro-text",
            props: {
                text: "Visual language via custom font. Handcrafted with AI assistance. A modern emblem for a timeless virtue. The CentroGreen identity merges the initials 'C' and 'G' to form the eye of the eagle—a powerful",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "image-scroll",
            id: "fu-visual-06",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-06.png",
                videoSrc: "/img/imgcases/folkeuniversitetet/fu-aifont.webm",
                alt: "Folkeuniversitetet AI Font generation",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "fu-visual-04",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-03.png",
                alt: "Folkeuniversitetet Platform UI",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "lottie",
            id: "fu-typo",
            props: {
                animationPath: "/img/imgcases/folkeuniversitetet/fu-font.json",
                loop: true,
                autoplay: true,
                aspectRatio: "aspect-[16/9]"
            }
        },
        {
            type: "image-scroll",
            id: "fu-visual-04",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-04.png",
                alt: "Folkeuniversitetet Platform UI",
                aspectRatio: "aspect-[16/9]",
            },
        },


        {
            type: "image-scroll",
            id: "fu-visual-05",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-05.png",
                alt: "Folkeuniversitetet Mobile Experience",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "grid-2-col",
            id: "fu-grid-v2",
            props: {
                left: {
                    src: "/img/imgcases/folkeuniversitetet/fu-case-07.png",
                    alt: "Folkeuniversitetet Brand Application 07",
                },
                right: {
                    src: "/img/imgcases/folkeuniversitetet/fu-case-09.png",
                    alt: "Folkeuniversitetet Brand Application 09",
                }
            }
        },
        {
            type: "image-scroll",
            id: "fu-visual-08",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-08.png",
                alt: "Folkeuniversitetet Campaign Visual",
                aspectRatio: "aspect-[16/9]",
            },
        },

        {
            type: "grid-2-col",
            id: "fu-grid-v3",
            props: {
                left: {
                    src: "/img/imgcases/folkeuniversitetet/fu-case-10.png",
                    alt: "Folkeuniversitetet UI Detail 11",
                },
                right: {
                    src: "/img/imgcases/folkeuniversitetet/fu-case-06.png",
                    alt: "Folkeuniversitetet UI Detail 12",
                }
            }
        },

        {
            type: "text-reveal",
            id: "intro-text",
            props: {
                text: "Character",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "image-scroll",
            id: "fu-visual-13",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-12.png",
                alt: "Folkeuniversitetet Final Showcase",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "fu-visual-13",
            props: {
                src: "/img/imgcases/folkeuniversitetet/fu-case-13.png",
                alt: "Folkeuniversitetet Final Showcase",
                aspectRatio: "aspect-[16/9]",
            },
        },
    ],
    details: {
        intro: "Folkeuniversitetet is one of Norway’s oldest and most trusted adult education institutions. Now part of Lingu, it offers language, vocational, digital and cultural courses across the country, online and on campus. Lingu asked us to refresh Folkeuniversitetet’s visual identity, evolve the logo, design a new website experience, and build a brand system the marketing team could actually use.",
        sections: [
            {
                title: "The Problem: Modern Expectations, Historic Brand",
                content: (
                    <p className="font-text text-text-md">
                        Folkeuniversitetet had the reputation, the reach and the impact. What it did not have was a visual expression that matched how modern adult learning works today. After the acquisition by Lingu, the brand needed to feel digital, open and contemporary, while keeping the familiar owl and colours that generations of Norwegians already trusted.
                    </p>
                ),
            },
            {
                title: "The Challenge: Do Not Touch the Owl",
                content: (
                    <p className="font-text text-text-md">
                        The brief came with one non-negotiable: keep the owl. It had been on buildings, diplomas and course brochures for decades. People recognised it instantly. Our job was to connect this legacy symbol with Lingu’s more modern, innovative attitude, and make the combined identity work for thousands of students, teachers and staff across every touchpoint.
                    </p>
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
                    <p className="font-text text-text-md">
                        AI helped us where exploration is expensive: generating families of expressive letterforms and early mascot imagery that we later redrew by hand. It saved days of illustration work and opened visual options quickly. The actual decisions—art direction, typography, UX/UI and the final look of the identity—were made by the design team, not by the model.
                    </p>
                ),
            },
            {
                title: "The Result",
                content: (
                    <p className="font-text text-text-md">
                        Folkeuniversitetet now looks like what it already is: a serious institution that is not stuck in the past. The new identity is more open, contemporary and visually distinct, without losing the recognisable owl or the sense of trust built over 150 years. After launch, the in-house team used the system to drive strong campaigns and a refreshed web presence. Heritage stayed intact; everything else moved forward.
                    </p>
                ),
            },
        ],
        sidebar: [
            { label: "Year", value: "2024" },
            { label: "CLIENT", value: "Folkeuniversitetet" },
            { label: "INDUSTRY", value: "Education" },
            {
                label: "DELIVERABLES",
                value: (
                    <>
                        <p>Brand Strategy</p>
                        <p>Visual Identity</p>
                        <p>Web Design</p>
                        <p>Design System</p>
                    </>
                ),
            }
        ],
    },
    stats: {
        stats: [
            { value: "40+", label: "Regional Offices Unified" },
            { value: "150%", label: "Increase in Mobile Traffic" },
            { value: "12 mo", label: "Project Duration" },
            { value: "1", label: "Unified Platform" },
        ],
    },
    nextCase: {
        title: "TheyTalk",
        subtitle: "Influencer Marketing Platform",
        link: "/works/theytalk",
        videoPath: "/img/imgcases/theytalk/theytalk-full.webm",
    }
};
