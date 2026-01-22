"use client";

import { useState, useRef, useEffect } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { CaseStudyDetails } from "@/components/CaseStudyDetails";
import { StatsBlock } from "@/components/StatsBlock";
import { ScrollRevealImage } from "@/components/ScrollRevealImage";
import { TextReveal } from "@/components/TextReveal";
import { Navbar } from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProblemCard = ({ title, description }: { title: string; description: string }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%",
                },
            }
        );
    }, []);

    return (
        <div
            ref={cardRef}
            className="bg-[#F5F5F5] p-8 rounded-2xl flex flex-col justify-between h-full hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#E8E8E8]"
        >
            <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-medium text-black leading-tight italic">
                    "{title}"
                </h3>
                <p className="text-black/60 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

const ProcessBlock = ({ step, title, description }: { step: string; title: string; description: string }) => {
    const blockRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            blockRef.current,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: blockRef.current,
                    start: "top 85%",
                },
            }
        );
    }, []);

    return (
        <div ref={blockRef} className="border-t border-black/10 pt-8 pb-12">
            <span className="text-red-600 font-medium text-sm mb-4 block">{step}</span>
            <h3 className="text-2xl md:text-3xl font-medium mb-4">{title}</h3>
            <p className="text-black/60 max-w-sm">{description}</p>
        </div>
    );
};

export default function ContentEnginePage() {
    const [isHeroPlaying, setIsHeroPlaying] = useState(false);

    const introText = "Content Engine Monthly is a subscription-based content production service designed for growing teams. It provides a fixed-price, scalable solution for brands that need high-quality content without the overhead of a full in-house team.";

    const patterns = [
        { title: "We don't believe we have a plan.", description: "We don't have a content team..." },
        { title: "We just output as we go.", description: "Lack of consistency and long-term strategy makes every post feel like a one-off effort." },
        { title: "Feedback and content is everywhere.", description: "Communication silos and messy approval loops slow down the entire production cycle." },
        { title: "No cohesive approach to social media.", description: "Each platform feels like a different brand, confusing your audience and diluting impact." },
        { title: "We have plenty of ideas, just no execution.", description: "Great concepts are left on the table because there's nobody to actually build them." },
        { title: "Teams are feeling stifled.", description: "Creative bottlenecks prevent your best people from moving at the speed of your business." },
    ];

    const sections = [
        {
            title: "The Case",
            content: (
                <p>
                    We built Content Engine Monthly to bridge the gap between expensive agencies and unreliable freelancers. A "productized service" that delivers premium content with the predictability of software.
                </p>
            )
        },
        {
            title: "Content Delivered",
            content: (
                <div className="space-y-6">
                    <p>
                        Month after month, we handle the heavy lifting. From strategy to final delivery, your brand stays active and visible across all channels.
                    </p>
                </div>
            )
        }
    ];

    const sidebar = [
        { label: "Year", value: "2026" },
        { label: "CLIENT / LOCATION", value: "Content Engine (UK/Global)" },
        {
            label: "INDUSTRY",
            value: (
                <>
                    <p>Content Production</p>
                    <p>Subscription Service</p>
                </>
            )
        },
        {
            label: "DELIVERABLES",
            value: (
                <>
                    <p>Strategy</p>
                    <p>Production</p>
                    <p>Distribution</p>
                </>
            )
        },
        {
            label: "VALUE PROP",
            isRed: true,
            value: (
                <>
                    <p>Zero Overhead</p>
                    <p>Flexible Mix</p>
                </>
            )
        }
    ];

    return (
        <main className="min-h-screen bg-white font-body selection:bg-red-500 selection:text-white">
            <Navbar isHidden={isHeroPlaying} />

            <HeroVideo
                title="Content Engine Monthly"
                subtitle="Your brand, always visible — without the overhead"
                videoPath="/img/imgcases/centrogreen/centrogreen-reel.webm"
                posterPath="/img/imgcases/centrogreen/cg-image-01.jpg"
                tags={["Brand Visibility", "Zero Overhead", "Flexible Growth"]}
                onPlayChange={setIsHeroPlaying}
            />

            {/* Hero CTAs */}
            <div className="container mx-auto px-4 md:px-8 -mt-12 relative z-20 flex gap-4 justify-center">
                <button className="px-8 py-4 bg-red-600 text-white rounded-full font-medium hover:bg-black transition-colors duration-300">
                    Book A Call
                </button>
                <button className="px-8 py-4 border border-black/10 text-black rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300">
                    View Packages
                </button>
            </div>

            <section className="py-20">
                {/* Intro */}
                <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
                    <TextReveal
                        text="Content Engine Monthly is your partner in consistent brand visibility. No recruitment, no management, just high-quality production."
                        className="text-large w-full md:w-[70%] text-left font-body text-black/90"
                    />
                </div>

                {/* Problems Section */}
                <div className="bg-white py-24 md:py-32">
                    <div className="container mx-auto px-4 md:px-8 mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium mb-4">Patterns we see across growing teams</h2>
                        <p className="text-black/60 text-lg">If this sounds familiar, you're not alone.</p>
                    </div>
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patterns.map((p, i) => (
                                <ProblemCard key={i} title={p.title} description={p.description} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-8">
                    <ScrollRevealImage
                        src="/img/imgcases/centrogreen/cg-image-01.jpg"
                        alt="Content Engine Production"
                        aspectRatio="aspect-video"
                    />
                </div>

                {/* Solution Section */}
                <div className="container mx-auto px-4 md:px-8 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-medium leading-tight">Meet Content Engine Monthly</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-red-600 flex-shrink-0 mt-1" />
                                <p className="text-black/60 text-xl italic">Content delivered month after month.</p>
                            </div>
                            <p className="text-black/60 text-xl max-w-md">
                                A dedicated engine that scales with you, providing the expertise you need without the HR complexity.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square bg-[#F5F5F5] rounded-3xl overflow-hidden">
                        <ScrollRevealImage
                            src="/img/imgcases/centrogreen/cg-image-04.jpg"
                            alt="CEM System"
                            aspectRatio="aspect-square"
                        />
                    </div>
                </div>

                {/* Core Value Prop */}
                <div className="container mx-auto px-4 md:px-8 py-24 border-y border-black/5 text-center">
                    <TextReveal
                        text="Fixed monthly price. Flexible content mix. Zero overhead."
                        className="text-3xl md:text-6xl font-medium text-red-600 block leading-tight"
                    />
                </div>

                {/* Why It Works Better */}
                <div className="container mx-auto px-4 md:px-8 py-24 md:py-32">
                    <h2 className="text-3xl md:text-5xl font-medium mb-16 text-center">Three reasons this works better</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white mb-6">01</div>
                            <h3 className="text-2xl font-medium">Fixed Monthly Rate</h3>
                            <p className="text-black/60">Predictable costs without HR overhead. Know exactly what you're spending every month.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white mb-6">02</div>
                            <h3 className="text-2xl font-medium">Flexible Content Mix</h3>
                            <p className="text-black/60">Shift your focus as your business evolves. Video this month, whitepapers the next.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white mb-6">03</div>
                            <h3 className="text-2xl font-medium">Scalable Production</h3>
                            <p className="text-black/60">Built-in systems to grow with your brand. Ramp up production as your needs expand.</p>
                        </div>
                    </div>
                </div>

                {/* Visibility Section */}
                <div className="bg-black text-white py-24 md:py-32">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-4xl">
                            <h2 className="text-4xl md:text-7xl font-medium mb-12">End-to-end content for brand visibility.</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {["LinkedIn", "Twitter", "Instagram", "Blog", "Newsletters", "Video", "Case Studies", "Whitesheets"].map((item) => (
                                    <div key={item} className="border-b border-white/10 pb-4">
                                        <p className="text-lg font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workflow Section */}
                <div className="bg-[#F5F5F5] py-24 md:py-32">
                    <div className="container mx-auto px-4 md:px-8 mb-20 text-center">
                        <h2 className="text-4xl md:text-6xl font-medium mb-6">Simple, predictable, effective</h2>
                    </div>
                    <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ProcessBlock step="01 / SHARE" title="You Share" description="Context, goals, and brand guidelines via our simple intake system." />
                        <ProcessBlock step="02 / PLAN" title="We Plan" description="Strategy and content calendars mapped to your business objectives." />
                        <ProcessBlock step="03 / CREATE" title="We Create" description="High-quality production across your selected content mix." />
                        <ProcessBlock step="04 / DELIVER" title="We Deliver" description="Review, approve, and publish your content with zero friction." />
                    </div>
                </div>

                <CaseStudyDetails
                    intro={introText}
                    sections={sections}
                    sidebar={sidebar}
                />

                {/* Pricing Section */}
                <div id="pricing" className="container mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
                    <h2 className="text-4xl md:text-6xl font-medium mb-16">Transparent Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter */}
                        <div className="p-10 border border-black/10 rounded-3xl bg-white hover:border-red-600 transition-colors group">
                            <p className="text-xs uppercase tracking-widest text-black/40 mb-2">Starter</p>
                            <p className="text-5xl font-medium mb-8">$0<span className="text-sm font-normal text-black/40">/mo</span></p>
                            <ul className="text-left space-y-4 mb-10 text-black/60">
                                <li>• Concept Strategy</li>
                                <li>• Brand Assessment</li>
                                <li>• Content Audit</li>
                            </ul>
                            <button className="w-full py-4 rounded-full border border-black/10 group-hover:bg-black group-hover:text-white transition-all">Get Started</button>
                        </div>
                        {/* Standard */}
                        <div className="p-10 border-2 border-red-600 rounded-3xl bg-white relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
                            <p className="text-xs uppercase tracking-widest text-black/40 mb-2">Standard</p>
                            <p className="text-5xl font-medium mb-8">$3,000<span className="text-sm font-normal text-black/40">/mo</span></p>
                            <ul className="text-left space-y-4 mb-10 text-black/60">
                                <li>• 12 Content Assets</li>
                                <li>• Social Media Management</li>
                                <li>• Weekly Strategy Sync</li>
                            </ul>
                            <button className="w-full py-4 rounded-full bg-red-600 text-white hover:bg-black transition-all">Choose Standard</button>
                        </div>
                        {/* Growth */}
                        <div className="p-10 border border-black/10 rounded-3xl bg-white hover:border-red-600 transition-colors group">
                            <p className="text-xs uppercase tracking-widest text-black/40 mb-2">Growth</p>
                            <p className="text-5xl font-medium mb-8">$5,500<span className="text-sm font-normal text-black/40">/mo</span></p>
                            <ul className="text-left space-y-4 mb-10 text-black/60">
                                <li>• Unlimited Creative</li>
                                <li>• Dedicated Manager</li>
                                <li>• Full Multi-channel Ops</li>
                            </ul>
                            <button className="w-full py-4 rounded-full border border-black/10 group-hover:bg-black group-hover:text-white transition-all">Choose Growth</button>
                        </div>
                    </div>
                </div>

                <StatsBlock stats={[
                    { value: "0", label: "Overhead Cost" },
                    { value: "48h", label: "Avg Turnaround" },
                    { value: "100%", label: "Satisfaction" },
                    { value: "∞", label: "Revisions" },
                ]} />
            </section>

            <footer className="bg-black text-white py-24 md:pt-32">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-left">
                        <div className="col-span-1 md:col-span-1">
                            <h3 className="text-2xl font-bold mb-6">#ContentEngine</h3>
                            <p className="text-white/50 text-sm">Your brand, always visible — without the overhead.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-red-600">Company</h4>
                            <ul className="space-y-4 text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-red-600">Product</h4>
                            <ul className="space-y-4 text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-red-600">Resources</h4>
                            <ul className="space-y-4 text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-8 text-white/50 text-sm">
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        </div>
                        <p className="text-white/30 text-xs">© 2026 Content Engine Monthly. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
