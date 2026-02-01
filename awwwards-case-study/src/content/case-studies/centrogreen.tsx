import { CaseStudyContent } from "@/types/case-study";

const deliverables = [
    {
        title: "Defined a clear, honest promise",
        text: "We framed CentroGreen around sustainable, bespoke air purification that focuses on perfecting details and protecting health, not on gimmicks or exaggerated claims."
    },
    {
        title: "Built a premium, technology-led identity",
        text: "We designed the visual identity to communicate trust, innovation, premium quality and accessibility, with a tone that feels precise rather than clinical."
    },
    {
        title: "Created a symbol rooted in local context",
        text: "We explored multiple logo directions and landed on a mark that combines a hawk-inspired eye with key letterforms, connecting advanced vision and local cultural references."
    },
    {
        title: "Launched a marketing site with a job",
        text: "We designed a marketing website whose main role is simple: tell the product story clearly and move users towards the e-commerce experience."
    },
    {
        title: "Focused on hero products first",
        text: "We structured the platform around detailed pages for the five main devices, keeping accessories and secondary products for a second phase to avoid clutter."
    },
    {
        title: "Developed 3D product visualisation",
        text: "We replaced weak photography with 3D renders and interactive views, giving the brand a central visual asset that works across website, one-pagers and social content."
    },
    {
        title: "Set up a reusable design system",
        text: "We documented the identity and components in a Figma-based design system, making it easy to scale new pages and formats while staying consistent."
    }
];

export const caseStudyCentrogreen: CaseStudyContent = {
    slug: "centrogreen",
    meta: {
        title: "Centrogreen - Case Study",
        description: "A New Air Standard for the UAE",
    },
    hero: {
        title: "Centrogreen",
        subtitle: "A New Air Standard for the UAE",
        videoPath: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        posterPath: "/img/imgcases/centrogreen/cg-image-01.jpg",
        tags: ["Brand Identity", "Web Experience", "Product Visualization"],
    },
    blocks: [
        {
            type: "text-reveal",
            id: "intro-text",
            props: {
                text: "CentroGreen (UAE) is a regional leader in sustainable infrastructure and ecological innovation. ",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "logo-animation",
            id: "brand-logo-anim",
            props: {}
        },
        {
            type: "image-grid-hover",
            id: "brand-interactive-grid",
            props: {
                alt: "CentroGreen Interactive Showcase",
                heroSrc: "/img/imgcases/centrogreen/cg-hover.jpg",
                gridSrcs: [
                    "/img/imgcases/centrogreen/cg-grid1-01.jpg",
                    "/img/imgcases/centrogreen/cg-grid1-02.jpg",
                    "/img/imgcases/centrogreen/cg-grid1-03.jpg",
                    "/img/imgcases/centrogreen/cg-grid1-04.jpg",
                ],
            },
        },
        {
            type: "centrogreen-designcode",
            id: "brand-design-system",
            props: {}
        },
        {
            type: "text-reveal",
            id: "brand-intro-msg",
            props: {
                text: "CentroGreen (UAE) is a regional leader in sustainable infrastructure and ecological innovation. Our task was to redefine their digital footprint, blending high-tech precision with the organic warmth of their environmental mission.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-01",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-01.png",
                videoSrc: "/img/imgcases/centrogreen/cg-brand-01.webm",
                alt: "CentroGreen Brand Visual 01",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-02",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-02.png",
                alt: "CentroGreen Brand Visual 02",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-03",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-03.png",
                alt: "CentroGreen Brand Visual 03",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-04",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-04.png",
                alt: "CentroGreen Brand Visual 04",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-05",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-05.png",
                alt: "CentroGreen Brand Visual 05",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "image-scroll",
            id: "brand-visual-06",
            props: {
                src: "/img/imgcases/centrogreen/cg-brand-06.png",
                alt: "CentroGreen Brand Visual 06",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "grid-2-col",
            id: "brand-grid-v1",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-brand-07.png",
                    alt: "CentroGreen Brand Grid 01 Left",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-brand-08.png",
                    alt: "CentroGreen Brand Grid 01 Right",
                    aspectRatio: "aspect-square",
                }
            }
        },
        {
            type: "grid-2-col",
            id: "brand-grid-v2",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-brand-09.png",
                    alt: "CentroGreen Brand Grid 02 Left",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-brand-10.png",
                    videoSrc: "/img/imgcases/centrogreen/cg-brand-10.webm",
                    alt: "CentroGreen Brand Grid 02 Right",
                    aspectRatio: "aspect-square",
                }
            },
        },
        {
            type: "text-reveal",
            id: "web-intro-msg",
            props: {
                text: "The visual system relies on a palette of deep forest greens balanced by stark, laboratory whites. This duality reflects their commitment to both cutting-edge science and the preservation of natural landscapes.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            }
        },
        {
            type: "image-scroll",
            id: "web-visual-01",
            props: {
                src: "/img/imgcases/centrogreen/cg-web-01.png",
                videoSrc: "/img/imgcases/centrogreen/cg-web-01.webm",
                alt: "CentroGreen Web Visual 01",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "grid-2-col",
            id: "web-grid-v1",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-web-02.png",
                    alt: "CentroGreen Web Grid 01 Left",
                    aspectRatio: "aspect-[6/5]",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-web-03.png",
                    alt: "CentroGreen Web Grid 01 Right",
                    aspectRatio: "aspect-[6/5]",
                }
            }
        },
        {
            type: "text-reveal",
            id: "product-intro-msg",
            props: {
                text: "The visual system relies on a palette of deep forest greens balanced by stark, laboratory whites. This duality reflects their commitment to both cutting-edge science and the preservation of natural landscapes.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            }
        },
        {
            type: "image-scroll",
            id: "product-visual-01",
            props: {
                src: "/img/imgcases/centrogreen/cg-product-01.png",
                alt: "CentroGreen Product Visual 01",
                aspectRatio: "aspect-[16/9]",
            },
        },
        {
            type: "grid-2-col",
            id: "product-grid-v1",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-product-02.png",
                    alt: "CentroGreen Product Grid 01 Left",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-product-03.png",
                    alt: "CentroGreen Product Grid 01 Right",
                    aspectRatio: "aspect-square",
                }
            }
        },
        {
            type: "grid-3-col",
            id: "product-grid-v2",
            props: {
                items: [
                    {
                        src: "/img/imgcases/centrogreen/cg-product-04.png",
                        alt: "CentroGreen Product Grid 02 Item 1",
                        aspectRatio: "aspect-[4/5]",
                    },
                    {
                        src: "/img/imgcases/centrogreen/cg-product-05.png",
                        alt: "CentroGreen Product Grid 02 Item 2",
                        aspectRatio: "aspect-[4/5]",
                    },
                    {
                        src: "/img/imgcases/centrogreen/cg-product-06.png",
                        alt: "CentroGreen Product Grid 02 Item 3",
                        aspectRatio: "aspect-[4/5]",
                    },
                ]
            }
        },

    ],
    details: {
        intro:
            "CentroGreen is a new air purification brand in the United Arab Emirates, importing premium Korean devices into a market dominated by global and local heavyweights. The products use advanced filtration and chemical processes to clean indoor air and help protect health. Our role was to create the brand from scratch: strategy, visual identity, marketing website, 3D product visuals, and a digital foundation that can grow into a full go-to-market engine.",
        sections: [
            {
                title: "The Problem: Unknown Brand, High-Stakes Category",
                content: (
                    <p className="font-text text-text-md">
                        Air purifiers are on the rise in the UAE, driven by air quality concerns and climate conditions. The category, however, is already full of familiar names—Dyson, Swiss manufacturers, and a long tail of cheap, low-quality devices. CentroGreen arrived with excellent technology and almost zero recognition. It needed to look trustworthy, premium and serious about health, without hiding behind inflated metrics or fake claims.
                    </p>
                ),
            },
            {
                title: "The Challenge: Compete Without a Past",
                content: (
                    <p className="font-text text-text-md">
                        CentroGreen could not lean on decades of history or global awareness. The brand had to enter a crowded, noisy category with limited budget and a tight launch timeline, while the market was heating up. Our task was to position an upper mid-class, high-quality air purification brand that feels more advanced and more honest than its competitors, and to express that through identity, website and product storytelling.
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
                        AI supported us in research, naming and copy drafts, visual exploration, design system workflows and parts of code generation for the website. We used detailed prompts and structured inputs to get meaningful outputs quickly. The core work—art direction, logo, key visuals, messaging and UX decisions—was created and owned by the design team, with AI acting as an assistant, not as the author of the brand.
                    </p>
                ),
            },
            {
                title: "The Result",
                content: (
                    <p className="font-text text-text-md">
                        CentroGreen now enters the UAE market with a focused story, a recognisable identity and a digital presence that makes its technology understandable and desirable. Early signals show increased traffic, stronger engagement and longer time on site, while the e-commerce phase begins to build on this foundation. The project proves that even a new player, without a long history, can claim a credible space in a sensitive category—if the brand is built on clarity, precision and real product strength.
                    </p>
                ),
            },
        ],
        sidebar: [
            { label: "Year", value: "2025" },
            { label: "CLIENT / LOCATION", value: "CentroGreen (UAE)" },
            {
                label: "INDUSTRY",
                value: (
                    <>
                        <p>eCommerce </p>
                        <p> Manufacturing </p>
                    </>
                ),
            },
            {
                label: "DELIVERABLES",
                value: (
                    <>
                        <p>Branding </p>
                        <p> Website </p>
                        <p> Visual Communication Assets</p>
                    </>
                ),
            },
            {
                label: "AI-ASSISTED WORKFLOWS",
                isRed: true,
                value: (
                    <>
                        <p>Messaging and Tone of Voice</p>
                        <p>Product Visuals </p>
                    </>
                ),
            },
        ],
    },
    stats: {
        stats: [
            { value: "10+", label: "Logo variations" },
            { value: "100+", label: "visual assets created" },
            { value: "60 DAYS", label: "3 parallel projects, 7 roles" },
            { value: "2", label: "website versions (MVP + Full)" },

        ],
    },
    nextCase: {
        title: "TheyTalk",
        subtitle: "Coming Soon",
        link: "/works/theytalk", // Placeholder URL
        videoPath: "/videos/theytalk/theytalk-full.webm",
    }
};
