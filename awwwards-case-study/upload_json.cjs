const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'tmp_gcs_data');
const BUCKET_NAME = 'crisp-website-485112_cloudbuild';

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const files = {
    'home-hero.json': {
        heroText: {
            words: ["BOLD", "STUFF", "FOR", "BRANDS"],
            tagline: "Thinking hard on what's impressive since 2006."
        },
        columns: [
            {
                id: "col-1",
                width: "50vw",
                cells: [
                    {
                        id: "cell-1-1",
                        height: "100vh",
                        className: "bg-white text-brand border-r border-black/5 p-8 md:p-16 flex flex-col items-center justify-center",
                        contentType: "hero-text"
                    }
                ]
            },
            {
                id: "col-2",
                width: "35vw",
                cells: [
                    {
                        id: "cell-2-1",
                        height: "60vh",
                        className: "bg-text/5 text-text border-r border-b border-black/5 p-0",
                        contentType: "video",
                        contentProps: {
                            videoSrc: "/img/home-hero/home-01.webm"
                        }
                    },
                    {
                        id: "cell-2-2",
                        height: "40vh",
                        className: "bg-brand border-r border-black/5 p-0 overflow-hidden",
                        contentType: "distortion-image",
                        contentProps: {
                            src: "/img/home-hero/home-hero-03.png",
                            alt: "Hero Illustration"
                        }
                    }
                ]
            },
            {
                id: "col-3",
                width: "40vw",
                cells: [
                    {
                        id: "cell-3-1",
                        height: "35vh",
                        className: "bg-brand text-white border-r border-b border-black/5 p-0 flex items-center justify-center",
                        contentType: "lottie",
                        contentProps: {
                            lottieSrc: "/img/home-hero/home-hero-04.json"
                        }
                    },
                    {
                        id: "cell-3-2",
                        height: "65vh",
                        className: "bg-white text-text border-r border-black/5 p-0",
                        contentType: "video",
                        contentProps: {
                            videoSrc: "/img/home-hero/home-hero-03.webm"
                        }
                    }
                ]
            },
            {
                id: "col-4",
                width: "31.5vw",
                cells: [
                    {
                        id: "cell-4-1",
                        height: "60vh",
                        className: "bg-text/5 text-text border-r border-b border-black/5 p-0",
                        contentType: "video",
                        contentProps: {
                            videoSrc: "/img/home-hero/home-here-06.webm"
                        }
                    },
                    {
                        id: "cell-4-2",
                        height: "40vh",
                        className: "bg-brand text-white border-r border-black/5 p-0 overflow-hidden relative",
                        contentType: "spline",
                        contentProps: {
                            splineUrl: "/spline/scr_25/scene.splinecode"
                        }
                    }
                ]
            }
        ]
    },
    'home-services.json': {
        title: ["WHERE", "WE", "CAN", "HELP"],
        services: [
            {
                title: "Brand Strategy & Ideation",
                description: "Before a brand is a brand, it is an idea and the set of beliefs that inspired it. We co-shape the foundational visual",
                labels: ["DECISION-SHAPING WORKSHOPS", "BRAND FOUNDATION", "CREATIVE AND VISUAL CONCEPTS"]
            },
            {
                title: "Brand Identity & Design",
                description: "We craft distinctive visual identities that capture the essence of your brand and resonate with your audience.",
                labels: ["LOGOS AND BRAND MARKS", "TONE OF VOICE AND MESSAGING HOUSE", "HIGH-PERFORMING WEBSITES"]
            },
            {
                title: "Digital Experience",
                description: "Creating seamless digital experiences that engage users and drive meaningful interactions with your brand.",
                labels: ["USER EXPERIENCE DESIGN", "INTERFACE DESIGN", "INTERACTIVE PROTOTYPES"]
            }
        ]
    },
    'home-partner.json': {
        heading: {
            line1: "WE DELIVER.",
            line2: "WE PARTNER."
        },
        description: "Before a brand is a brand, it is an idea and the set of beliefs that inspired it."
    },
    'home-clients.json': {
        clients: [
            { name: "Lingu", src: "/img/client-logos/client-logo-15-lingu.svg", url: null },
            { name: "Centrogreen", src: "/img/client-logos/client-logo-09-centrogreen.svg", url: null },
            { name: "Folkeuniversitetet", src: "/img/client-logos/client-logo-14-folkeuniversitetet.svg", url: null },
            { name: "Moply", src: "/img/client-logos/client-logo-01-moply.svg", url: null },
            { name: "Reono", src: "/img/client-logos/client-logo-02-reono.svg", url: null },
            { name: "Swiss Professionals", src: "/img/client-logos/client-logo-03-swissprofessionals-small.svg", url: null },
            { name: "SparkSales", src: "/img/client-logos/client-logo-04-sparksales.svg", url: null },
            { name: "Fresh", src: "/img/client-logos/client-logo-08-fresh.svg", url: null },
            { name: "Entrilia", src: "/img/client-logos/client-logo-12-entrilia.svg", url: null },
            { name: "LastMile", src: "/img/client-logos/client-logo-13-lastmile.svg", url: null }
        ]
    },
    'home-stats.json': {
        stats: [
            { value: "10+", label: "Years of Experience" },
            { value: "50+", label: "Projects Included" },
            { value: "5", label: "Awwwards Won" },
            { value: "100%", label: "Client Satisfaction" }
        ]
    },
    'home-testimonials.json': {
        testimonials: [
            {
                quote: "Crisp transformed our digital presence with a {stunning website} that perfectly captures our brand essence. Their attention to detail and creative approach exceeded all expectations.",
                logo: "/img/client-logos/client-logo-15-lingu.svg",
                name: "Maria Schmidt",
                position: "CEO, Lingu"
            },
            {
                quote: "Working with Crisp was an absolute pleasure. They delivered a {sustainable, user-friendly platform} that truly reflects our commitment to environmental responsibility.",
                logo: "/img/client-logos/client-logo-09-centrogreen.svg",
                name: "Thomas Green",
                position: "Founder, Centrogreen"
            },
            {
                quote: "The team's ability to understand our vision and translate it into a {powerful digital experience} was remarkable. Our platform engagement increased by 300% after launch.",
                logo: "/img/imgcases/theytalk/tt-logo-top.svg",
                name: "Sarah Anderson",
                position: "Head of Product, TheyTalk"
            }
        ]
    },
    'home-faq.json': {
        "title": "Have questions?\nFind answers.",
        "items": [
            {
                "question": "Why should we choose you instead of a larger, well-known agency?",
                "answer": "You work directly with senior designers, not layered account structures. Smaller team. Faster decisions. Higher design involvement from leadership. No junior-heavy production model."
            },
            {
                "question": "How do we know you understand our business, not just visuals?",
                "answer": "Every project starts with structured positioning work before design begins. We define audience, competitive landscape, and communication priorities. Design decisions are linked to business objectives, not trends."
            },
            {
                "question": "What makes your branding approach different?",
                "answer": "We combine structured strategy with AI-accelerated exploration. That means broader concept testing in less time and more refined outcomes. Efficiency in process, depth in execution."
            },
            {
                "question": "How do you ensure the brand will work across digital products and websites?",
                "answer": "We design branding as a system, not a logo. Typography, spacing logic, motion principles, and UI compatibility are considered from day one. The brand is built to scale into Webflow sites, SaaS products, and marketing assets."
            },
            {
                "question": "What level of involvement will we have during the project?",
                "answer": "Clear checkpoints. You review strategic direction early. You approve concept direction before full system development. No surprises at the end."
            },
            {
                "question": "What happens if we don’t like the first concepts?",
                "answer": "We present distinct, well-argued directions. Feedback is structured and translated into clear iteration steps. The process is designed to converge, not wander."
            },
            {
                "question": "Do you have experience with companies like ours?",
                "answer": "We work with B2B, SaaS, and industrial companies that need clarity, not decoration. Our focus is functional visual systems that support growth, hiring, sales, and product communication."
            }
        ]
    }
};

for (const [filename, data] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Created ${filename}`);

    // Upload to GCS
    try {
        // Check if gsutil is available, otherwise use gcloud storage cp
        try {
            execSync(`gsutil cp ${filePath} gs://${BUCKET_NAME}/data/${filename}`);
            console.log(`Uploaded ${filename} to gs://${BUCKET_NAME}/data/${filename}`);
        } catch (e) {
            console.log(`gsutil failed, trying gcloud storage cp...`);
            execSync(`gcloud storage cp ${filePath} gs://${BUCKET_NAME}/data/${filename}`);
            console.log(`Uploaded ${filename} with gcloud storage cp`);
        }

    } catch (error) {
        console.error(`Failed to upload ${filename}:`, error.message);
    }
}
