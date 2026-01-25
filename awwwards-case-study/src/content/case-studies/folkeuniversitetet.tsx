import { CaseStudyContent } from "@/types/case-study";

export const caseStudyFolkeuniversitetet: CaseStudyContent = {
    slug: "folkeuniversitetet",
    meta: {
        title: "Folkeuniversitetet - Case Study",
        description: "Empowering education through digital transformation",
    },
    hero: {
        title: "Folkeuniversitetet",
        subtitle: "Empowering education through digital transformation",
        videoPath: "/img/imgcases/centrogreen/centrogreen-reel.webm", // Placeholder as per original file
        posterPath: "/img/imgcases/centrogreen/cg-image-01.jpg", // Placeholder as per original file
        tags: ["Digital Strategy", "Brand Identity", "Platform Design"],
    },
    details: {
        intro: "Folkeuniversitetet is a leading educational institution. (Case Study Coming Soon)",
        sections: [
            {
                title: "Coming Soon",
                content: "Full case study coming soon.",
            }
        ],
        sidebar: [
            { label: "Year", value: "2024" },
            { label: "CLIENT", value: "Folkeuniversitetet" },
            { label: "INDUSTRY", value: "Education" },
            { label: "DELIVERABLES", value: "Strategy & Design" }
        ],
    },
    blocks: [
        {
            type: "text-reveal",
            id: "coming-soon",
            props: {
                text: "Case Study Coming Soon",
                className: "font-heading text-h2 text-text/50 uppercase tracking-widest text-center py-40"
            }
        }
    ],
    stats: {
        stats: [], // Empty stats for now or placeholders
    },
};
