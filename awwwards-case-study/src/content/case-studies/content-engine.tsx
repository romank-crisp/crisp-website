import { CaseStudyContent } from "@/types/case-study";

export const caseStudyContentEngine: CaseStudyContent = {
    slug: "content-engine",
    meta: {
        title: "Content Engine Monthly - Case Study",
        description: "Your brand, always visible — without the overhead.",
    },
    hero: {
        title: "Content Engine Monthly",
        subtitle: "Your brand, always visible — without the overhead",
        videoPath: "/img/imgcases/centrogreen/centrogreen-reel.webm",
        posterPath: "/img/imgcases/centrogreen/cg-image-01.jpg",
        tags: ["Brand Visibility", "Zero Overhead", "Flexible Growth"],
    },
    stats: {
        stats: [
            { value: "0", label: "Overhead Cost" },
            { value: "48h", label: "Avg Turnaround" },
            { value: "100%", label: "Satisfaction" },
            { value: "∞", label: "Revisions" },
        ],
    },
    details: {
        intro: "Content Engine Monthly is a subscription-based content production service designed for growing teams. It provides a fixed-price, scalable solution for brands that need high-quality content without the overhead of a full in-house team.",
        sections: [
            {
                title: "The Case",
                content: "We built Content Engine Monthly to bridge the gap between expensive agencies and unreliable freelancers. A \"productized service\" that delivers premium content with the predictability of software."
            },
            {
                title: "Content Delivered",
                content: "Month after month, we handle the heavy lifting. From strategy to final delivery, your brand stays active and visible across all channels."
            }
        ],
        sidebar: [
            { label: "Year", value: "2026" },
            { label: "CLIENT / LOCATION", value: "Content Engine (UK/Global)" },
            {
                label: "INDUSTRY",
                value: (
                    <>
                    <p>Content Production</ p >
            <p>Subscription Service </p>
            </>
                )
            },
{
    label: "DELIVERABLES",
        value: (
            <>
            <p>Strategy </p>
            < p > Production </p>
            < p > Distribution </p>
            </>
        )
},
{
    label: "VALUE PROP",
        isRed: true,
            value: (
                <>
                <p>Zero Overhead </p>
                    < p > Flexible Mix </p>
                        </>
                )
}
        ]
    },
blocks: [
    {
        type: "text-reveal",
        id: "intro-text",
        props: {
            text: "Content Engine Monthly is your partner in consistent brand visibility. No recruitment, no management, just high-quality production.",
            className: "font-text text-lg w-full md:w-[70%] text-left text-black/90",
        }
    },
    {
        type: "feature-grid",
        id: "problems-grid",
        props: {
            title: "Patterns we see across growing teams",
            subtitle: "If this sounds familiar, you're not alone.",
            features: [
                { title: "We don't believe we have a plan.", description: "We don't have a content team..." },
                { title: "We just output as we go.", description: "Lack of consistency and long-term strategy makes every post feel like a one-off effort." },
                { title: "Feedback and content is everywhere.", description: "Communication silos and messy approval loops slow down the entire production cycle." },
                { title: "No cohesive approach to social media.", description: "Each platform feels like a different brand, confusing your audience and diluting impact." },
                { title: "We have plenty of ideas, just no execution.", description: "Great concepts are left on the table because there's nobody to actually build them." },
                { title: "Teams are feeling stifled.", description: "Creative bottlenecks prevent your best people from moving at the speed of your business." },
            ]
        }
    },
    {
        type: "image-scroll",
        id: "visual-01",
        props: {
            src: "/img/imgcases/centrogreen/cg-image-01.jpg",
            alt: "Content Engine Production",
            aspectRatio: "aspect-video",
        }
    },
    {
        type: "content-split",
        id: "solution-split",
        props: {
            heading: "Meet Content Engine Monthly",
            image: {
                src: "/img/imgcases/centrogreen/cg-image-04.jpg", // Placeholder re-used
                alt: "CEM System",
            },
            text: (
                <div className= "space-y-4" >
                <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-brand flex-shrink-0 mt-1" />
                        < p className="text-black/60 text-xl italic" > Content delivered month after month.</p>
                            </div>
                            < p className="text-black/60 text-xl max-w-md" >
                            A dedicated engine that scales with you, providing the expertise you need without the HR complexity.
                         </p>
                                </div>
                )
        }
    },
    {
        type: "text-reveal",
        id: "value-prop-text",
        props: {
            text: "Fixed monthly price. Flexible content mix. Zero overhead.",
            className: "text-3xl md:text-6xl font-medium text-brand block leading-tight text-center border-y border-black/5 py-24", // Customizing className here might require global CSS or style fix
        }
    },
    {
        type: "feature-grid", // Reuse feature grid for "Three reasons" or generic 3-col
        id: "three-reasons",
        props: {
            title: "Three reasons this works better",
            features: [
                { title: "Fixed Monthly Rate", description: "Predictable costs without HR overhead. Know exactly what you're spending every month." },
                { title: "Flexible Content Mix", description: "Shift your focus as your business evolves. Video this month, whitepapers the next." },
                { title: "Scalable Production", description: "Built-in systems to grow with your brand. Ramp up production as your needs expand." }
            ]
        }
    },
    // "Visibility Section" (Black bg text + list) could be another generic block or just a specialized text-reveal/grid. 
    // For now, let's try mapping closely or omitting if too custom.
    // Actually, the black section is simple enough to be a generic "SectionHeader" + "List". 
    // Let's stick to what we built: ProcessSteps for the bottom part.
    {
        type: "process-steps",
        id: "workflow-steps",
        props: {
            title: "Simple, predictable, effective",
            steps: [
                { stepLabel: "01 / SHARE", title: "You Share", description: "Context, goals, and brand guidelines via our simple intake system." },
                { stepLabel: "02 / PLAN", title: "We Plan", description: "Strategy and content calendars mapped to your business objectives." },
                { stepLabel: "03 / CREATE", title: "We Create", description: "High-quality production across your selected content mix." },
                { stepLabel: "04 / DELIVER", title: "We Deliver", description: "Review, approve, and publish your content with zero friction." },
            ]
        }
    },
    {
        type: "pricing-table",
        id: "pricing",
        props: {
            title: "Transparent Pricing",
            tiers: [
                {
                    name: "Starter",
                    price: "$0",
                    priceSuffix: "/mo",
                    features: ["Concept Strategy", "Brand Assessment", "Content Audit"],
                    ctaLabel: "Get Started",
                    style: "default"
                },
                {
                    name: "Standard",
                    price: "$3,000",
                    priceSuffix: "/mo",
                    features: ["12 Content Assets", "Social Media Management", "Weekly Strategy Sync"],
                    ctaLabel: "Choose Standard",
                    isPopular: true,
                    style: "highlight"
                },
                {
                    name: "Growth",
                    price: "$5,500",
                    priceSuffix: "/mo",
                    features: ["Unlimited Creative", "Dedicated Manager", "Full Multi-channel Ops"],
                    ctaLabel: "Choose Growth",
                    style: "default"
                }
            ]
        }
    }
]
};
