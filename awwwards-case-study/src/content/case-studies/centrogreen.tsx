import { CaseStudyContent } from "@/types/case-study";

export const caseStudyCentrogreen: CaseStudyContent = {
    slug: "centrogreen",
    meta: {
        title: "Centrogreen - Case Study",
        description: "Launching a bespoke air quality solutions brand in Emirates",
    },
    hero: {
        title: "Centrogreen",
        subtitle: "Launching a bespoke air quality solutions brand in Emirates",
        videoPath: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        posterPath: "/img/imgcases/centrogreen/cg-image-01.jpg",
        tags: ["Brand Identity", "Web Experience", "Product Visualization"],
    },
    stats: {
        stats: [
            { value: "40d", label: "Delivered in " },
            { value: "30+", label: "Brand Assets" },
            { value: "6", label: "Roles involved" },
            { value: "+15%/mo", label: "Traffic Growth" },
        ],
    },
    details: {
        intro:
            "CentroGreen is a new air purification brand created for a wholesale company in the United Arab Emirates. The client distributes premium air purifiers in a fast-growing category and needed a clear, credible presence in the local market.",
        sections: [
            {
                title: "The Case",
                content: (
                    <p className="font-text text-text-md" >
                        We were asked to build the brand from the ground up, including
                        strategy, visual identity, visual communication, a marketing website, product
                        pages, 3D product visualisations, and a digital design system to support
                        ongoing launch activities.
                    </p>
                ),
            },
            {
                title: "Problem",
                content: (
                    <div className="space-y-24" >
                        <p className="font-text text-text-md" >
                            The product and brand strategy were not yet defined when we started, so
                            we had to create the brand foundation and voice from scratch while the
                            market window was already open.Budget and timing were tight for a new
                            product, and there were no usable product images, only basic photos.
                        </p>
                        <p className="font-text text-text-md" >
                            The challenge was to design a locally relevant, premium brand system
                            that could quickly support launch, differentiate from strong competitors,
                            and stay flexible for future e - commerce and campaigns.
                        </p>
                    </div>
                ),
            },
            {
                title: "Solution and Deliverables",
                content: (
                    <div className="space-y-24" >
                        <p className="font-text text-text-md" >
                            The product and brand strategy were not yet defined when we started, so
                            we had to create the brand foundation and voice from scratch while the
                            market window was already open.Budget and timing were tight for a new
                            product, and there were no usable product images, only basic photos.
                        </p>
                        <p className="font-text text-text-md" >
                            The challenge was to design a locally relevant, premium brand system
                            that could quickly support launch, differentiate from strong competitors,
                            and stay flexible for future e - commerce and campaigns.
                        </p>
                    </div>
                ),
            },
            {
                title: "AI-Assisted Workflows",
                content: (
                    <div className="space-y-24" >
                        <p className="font-text text-text-md" >
                            AI supported the project in research, information structuring, naming
                            options, copy drafts, visual exploration, design system workflows, and
                            code generation for the website.
                        </p>
                        <p className="font-text text-text-md" >
                            We used detailed prompts and inputs so the outputs were targeted and
                            useful from the first iterations.
                        </p>
                        <p className="font-text text-text-md" >
                            Brand strategy, visual identity, logo, key visuals, and final messaging
                            were defined by the design and project teams, with AI used as a
                            supporting tool rather than a decision maker.
                        </p>
                    </div>
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
            id: "logo-hero-anim",
            props: {}
        },
        {
            type: "image-grid-hover",
            id: "showcase-grid",
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
            type: "image-scroll",
            id: "visual-02",
            props: {
                src: "/img/imgcases/centrogreen/cg-image-02.jpg",
                alt: "CentroGreen Visual 02",
                aspectRatio: "aspect-video",
            },
        },
        {
            type: "image-scroll",
            id: "visual-03",
            props: {
                src: "/img/imgcases/centrogreen/cg-image-03.jpg",
                alt: "CentroGreen Visual 03",
                aspectRatio: "aspect-video",
            },
        },
        {
            type: "text-reveal",
            id: "middle-text",
            props: {
                text: "CentroGreen (UAE) is a regional leader in sustainable infrastructure and ecological innovation. Our task was to redefine their digital footprint, blending high-tech precision with the organic warmth of their environmental mission.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            },
        },
        {
            type: "grid-2-col",
            id: "grid-1",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-image-04.jpg",
                    alt: "CentroGreen Visual 04",
                    aspectRatio: "aspect-square",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-image-05.jpg",
                    alt: "CentroGreen Visual 05",
                    aspectRatio: "aspect-square",
                }
            }
        },
        {
            type: "text-reveal",
            id: "bottom-text",
            props: {
                text: "The visual system relies on a palette of deep forest greens balanced by stark, laboratory whites. This duality reflects their commitment to both cutting-edge science and the preservation of natural landscapes.",
                className: "font-text text-text-lg w-full md:w-[60%] text-left text-text/90",
            }
        },
        {
            type: "image-scroll",
            id: "visual-06",
            props: {
                src: "/img/imgcases/centrogreen/cg-image-06.jpg",
                alt: "CentroGreen Visual 06",
                aspectRatio: "aspect-video",
            }
        },
        {
            type: "image-scroll",
            id: "visual-08",
            props: {
                src: "/img/imgcases/centrogreen/cg-image-08.jpg",
                alt: "CentroGreen Visual 08",
                aspectRatio: "aspect-[16/9]",
            }
        },
        {
            type: "grid-2-col",
            id: "grid-2",
            props: {
                left: {
                    src: "/img/imgcases/centrogreen/cg-image-09.jpg",
                    alt: "CentroGreen Visual 09",
                    aspectRatio: "aspect-[6/5]",
                },
                right: {
                    src: "/img/imgcases/centrogreen/cg-image-10.jpg",
                    alt: "CentroGreen Visual 10",
                    aspectRatio: "aspect-[6/5]",
                }
            }
        },
        {
            type: "grid-3-col",
            id: "grid-3",
            props: {
                items: [
                    {
                        src: "/img/imgcases/centrogreen/cg-image-01.jpg",
                        alt: "CentroGreen Visual 11 Placeholder",
                        aspectRatio: "aspect-[4/5]",
                    },
                    {
                        src: "/img/imgcases/centrogreen/cg-image-02.jpg",
                        alt: "CentroGreen Visual 12 Placeholder",
                        aspectRatio: "aspect-[4/5]",
                    },
                    {
                        src: "/img/imgcases/centrogreen/cg-image-03.jpg",
                        alt: "CentroGreen Visual 13 Placeholder",
                        aspectRatio: "aspect-[4/5]",
                    },
                ]
            }
        }
    ],
    nextCase: {
        title: "TheyTalk", // Assuming next case is TheyTalk based on video name
        subtitle: "Coming Soon",
        link: "/works/theytalk", // Placeholder URL
        videoPath: "/videos/theytalk/theytalk-full.webm",
    }
};
