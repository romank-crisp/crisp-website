"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";
import { getAssetUrl } from "@/lib/utils";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// Types & Config
// ---------------------------------------------------------------------------

export interface DeliverableV2 {
    id: string;
    label: string;
    /** Price per product for this deliverable */
    basePrice: number;
    /** Days per product for this deliverable */
    baseDays: number;
    /** Quantity of assets delivered per product */
    baseAssets?: number;
    /** @deprecated — kept for JSON compat, ignored in calculations */
    multiplier?: number;
    /** Image or video URL shown when active */
    media: string;
    /** Image shown when inactive/unselected */
    defaultMedia: string;
    /** "image" | "video" — defaults to "image" */
    mediaType?: "image" | "video";
}

interface IncrementTier {
    min: number;
    max: number;
    step: number;
}

interface EfficiencyTier {
    min: number;
    max: number;
    divisor: number;
}

export interface PriceCalculatorV2Data {
    sectionTitle: string;
    productLabel: string;
    deliverables: DeliverableV2[];
    incrementTiers: IncrementTier[];
    maxProducts: number;
    minProducts: number;
    efficiencyTiers: EfficiencyTier[];
    /** Placeholder shown on unselected cards */
    defaultPlaceholder: string;
    /** Labels for the results row */
    estimatedCostLabel: string;
    assetsDeliveredLabel: string;
    totalCostLabel: string;
    ctaLabel: string;
    ctaCaption: string;
    deliveryUnit: string;
    assetsUnit: string;
    /** @deprecated — kept for JSON backward compat */
    basePricePerProduct?: number;
    /** @deprecated — kept for JSON backward compat */
    baseDaysPerProduct?: number;
}

const CALC_IMG_BASE = "/img/services/ai-case-study/calc";

const DEFAULT_CONFIG: PriceCalculatorV2Data = {
    sectionTitle: "TRANSPARENT\nFAIR PRICING",
    productLabel: "How many products need visuals?",
    defaultPlaceholder: `${CALC_IMG_BASE}/ai-calc-default.png`,
    deliverables: [
        {
            id: "product-shots",
            label: "Product Shots",
            basePrice: 50,
            baseDays: 1,
            baseAssets: 5,
            media: `${CALC_IMG_BASE}/ai-calc-productshots.png`,
            defaultMedia: `${CALC_IMG_BASE}/ai-calc-default.png`,
            mediaType: "image",
        },
        {
            id: "campaign-visuals",
            label: "Campaign Visuals",
            basePrice: 75,
            baseDays: 1.5,
            baseAssets: 3,
            media: `${CALC_IMG_BASE}/ai-calc-campaing visuals.png`,
            defaultMedia: `${CALC_IMG_BASE}/ai-calc-default.png`,
            mediaType: "image",
        },
        {
            id: "marketing-videos",
            label: "Marketing Videos",
            basePrice: 100,
            baseDays: 2,
            baseAssets: 1,
            media: `${CALC_IMG_BASE}/ai-video_1.mp4`,
            defaultMedia: `${CALC_IMG_BASE}/ai-calc-default.png`,
            mediaType: "video",
        },
        {
            id: "campaign-assets",
            label: "Campaign Assets",
            basePrice: 75,
            baseDays: 1.5,
            baseAssets: 4,
            media: `${CALC_IMG_BASE}/ai-calc-campaignassets.png`,
            defaultMedia: `${CALC_IMG_BASE}/ai-calc-default.png`,
            mediaType: "image",
        },
    ],
    incrementTiers: [
        { min: 1, max: 5, step: 1 },
        { min: 6, max: 10, step: 1 },
        { min: 11, max: 20, step: 5 },
        { min: 21, max: 50, step: 10 },
        { min: 51, max: 100, step: 10 },
    ],
    maxProducts: 100,
    minProducts: 5,
    efficiencyTiers: [
        { min: 1, max: 5, divisor: 1 },
        { min: 6, max: 10, divisor: 0.75 },
        { min: 11, max: 20, divisor: 2 },
        { min: 21, max: 50, divisor: 3 },
        { min: 51, max: 100, divisor: 4 },
    ],
    estimatedCostLabel: "Estimated package cost",
    assetsDeliveredLabel: "Assets delivered",
    totalCostLabel: "Total package cost",
    ctaLabel: "Get a quote",
    ctaCaption: "Start it easy!",
    deliveryUnit: "days",
    assetsUnit: "assets",
};


// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function getStepForCount(count: number, tiers: IncrementTier[]): number {
    for (const tier of tiers) {
        if (count >= tier.min && count <= tier.max) return tier.step;
    }
    return 1;
}

function getEfficiencyDivisor(count: number, tiers: EfficiencyTier[]): number {
    for (const tier of tiers) {
        if (count >= tier.min && count <= tier.max) return tier.divisor;
    }
    return 1;
}


// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated number with vertical slide */
function AnimatedNumber({
    value,
    prefix = "",
    suffix = "",
    className,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}) {
    return (
        <span className={`${className} inline-flex overflow-hidden`}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {prefix}{value.toLocaleString()}{suffix}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}


/** Product count display with vertical slide animation */
function AnimatedCount({ value, className }: { value: number; className?: string }) {
    return (
        <div className={`${className} overflow-hidden relative`}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 60, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -60, opacity: 0, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="inline-block tabular-nums"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}


/** Deliverable card with image/video and checkmark overlay */
function DeliverableCard({
    deliverable,
    active,
    onToggle,
}: {
    deliverable: DeliverableV2;
    active: boolean;
    onToggle: () => void;
}) {
    const isVideo = deliverable.mediaType === "video";
    const activeSrc = getAssetUrl(deliverable.media);
    const defaultSrc = getAssetUrl(deliverable.defaultMedia);
    const mediaSrc = active ? activeSrc : defaultSrc;

    return (
        <button
            onClick={onToggle}
            className="group relative flex flex-col items-start text-left w-full cursor-pointer"
        >
            {/* Card — fills full height, enforced min-height */}
            <div
                className={`
                    relative w-full aspect-square h-[180px] md:h-[338px] rounded-[16px] md:rounded-[24px] overflow-hidden
                    transition-all duration-500 ease-out
                    ${active
                        ? "border-2 border-brand/60 shadow-[0_0_30px_rgba(224,12,51,0.15)]"
                        : "border border-white/10"
                    }
                `}
            >
                {/* Media — always shown, grayscale when inactive */}
                {isVideo && active ? (
                    <video
                        src={activeSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={mediaSrc}
                        alt={deliverable.label}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                )}

                {/* Dark gradient overlay — stronger when inactive */}
                <div
                    className={`
                        absolute inset-0 transition-opacity duration-500
                        ${active
                            ? "bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-100"
                            : "bg-[#120c2a]/60 opacity-100"
                        }
                    `}
                />

                {/* Label inside card at top */}
                <span
                    className={`
                        absolute top-[24px] left-5 right-5 z-10 text-center
                        font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase
                        transition-colors duration-300
                        ${active ? "text-white/80" : "text-white/40"}
                    `}
                >
                    {deliverable.label}
                </span>

                {/* Checkmark badge */}
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[36px] h-[36px] md:w-[44px] md:h-[44px] bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/30"
                        >
                            <Check className="text-white w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
}


// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface AIVisualPriceCalculatorV2Props {
    data?: PriceCalculatorV2Data;
}

export function AIVisualPriceCalculatorV2({ data }: AIVisualPriceCalculatorV2Props) {
    const config = data ?? DEFAULT_CONFIG;
    const sectionRef = useRef<HTMLElement>(null);
    const minProducts = config.minProducts ?? 5;

    // --- State ---
    const [productCount, setProductCount] = useState(minProducts);
    const [activeDeliverables, setActiveDeliverables] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        config.deliverables.forEach((d, i) => {
            initial[d.id] = i !== 0; // All ON except first
        });
        return initial;
    });

    // --- Handlers ---
    const increment = useCallback(() => {
        setProductCount((prev) => {
            const step = getStepForCount(prev, config.incrementTiers);
            return Math.min(prev + step, config.maxProducts);
        });
    }, [config]);

    const decrement = useCallback(() => {
        setProductCount((prev) => {
            const step = getStepForCount(prev - 1, config.incrementTiers);
            return Math.max(prev - step, minProducts);
        });
    }, [config, minProducts]);

    const toggleDeliverable = useCallback((id: string) => {
        setActiveDeliverables((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const activeDeliverablesList = useMemo(() =>
        config.deliverables.filter(d => activeDeliverables[d.id]),
        [activeDeliverables, config.deliverables]);

    const hasAnyDeliverable = activeDeliverablesList.length > 0;

    const totalAssets = useMemo(() => {
        if (!hasAnyDeliverable) return 0;
        const sumAssets = activeDeliverablesList.reduce((s, d) => s + (d.baseAssets ?? 10), 0);
        return productCount * sumAssets;
    }, [productCount, activeDeliverablesList, hasAnyDeliverable]);

    const progressiveDiscount = useMemo(() => {
        if (productCount <= 10) return 0;
        const countForDiscount = Math.min(productCount, 50);
        return Math.floor(countForDiscount / 5) * 5;
    }, [productCount]);

    const estimatedCost = useMemo(() => {
        if (!hasAnyDeliverable) return 0;
        const sumPrices = activeDeliverablesList.reduce((s, d) => s + d.basePrice, 0);
        const raw = productCount * sumPrices;
        return progressiveDiscount > 0
            ? Math.round(raw * (1 - progressiveDiscount / 100))
            : Math.round(raw);
    }, [productCount, activeDeliverablesList, hasAnyDeliverable, progressiveDiscount]);

    const estimatedDays = useMemo(() => {
        if (!hasAnyDeliverable) return 0;
        const divisor = getEfficiencyDivisor(productCount, config.efficiencyTiers);
        const sumDays = activeDeliverablesList.reduce((s, d) => s + d.baseDays, 0);
        return Math.round((productCount * sumDays) / divisor);
    }, [productCount, config, activeDeliverablesList, hasAnyDeliverable]);

    // --- Contact form ---
    const { openContactFormWithData } = useContactForm();

    const handleOpenContactForm = useCallback(() => {
        const activeNames = config.deliverables
            .filter(d => activeDeliverables[d.id])
            .map(d => d.label.toLowerCase());

        let msg = `Hi, I'd like to get a quote for ${productCount} products`;
        if (activeNames.length > 0) {
            msg += ` with ${activeNames.join(', ')}`;
        }
        msg += '.';

        openContactFormWithData({
            service: 'content-creation',
            message: msg,
            showUpload: true,
        });

        // Focus the name field after the form opens
        setTimeout(() => {
            const nameInput = document.getElementById('contact-name');
            if (nameInput) nameInput.focus();
        }, 600);
    }, [productCount, activeDeliverables, config, openContactFormWithData]);

    // --- GSAP entrance ---
    useGSAP(() => {
        if (!sectionRef.current) return;
        const els = sectionRef.current.querySelectorAll(".calc-v2-reveal");
        gsap.fromTo(
            els,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            },
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="w-full bg-text text-white overflow-hidden relative pt-[120px] pb-[60px] md:py-[160px]"
        >
            <div className="w-full max-w-[1475px] mx-auto px-6 md:px-16">

                {/* ── Title ── */}
                <h2 className="calc-v2-reveal font-mega text-mega-h2 uppercase text-white leading-[0.88] tracking-[4.5px] mb-[48px] md:mb-[100px]">
                    TRANSPARENT{" "}
                    <span className="text-white">Fair pricing</span>
                </h2>


                {/* ── Calculator Row: Counter + Deliverable Cards ── */}
                <div className="calc-v2-reveal flex flex-col md:flex-row gap-3 md:gap-5 mb-[48px] md:mb-[100px]">

                    {/* Product Counter Card — appears after deliverables on mobile */}
                    <div className="flex-shrink-0 w-full md:w-[280px] lg:w-[320px] flex flex-col order-2 md:order-1">
                        <div className="relative border border-white/10 rounded-[24px] h-[180px] md:h-[338px] flex flex-col items-center justify-center px-[32px]">
                            {/* Label inside card at top */}
                            <span className="absolute top-5 left-5 right-5 font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50 text-center">
                                {config.productLabel}
                            </span>

                            {/* Minus */}
                            <button
                                onClick={decrement}
                                disabled={productCount <= minProducts}
                                className="absolute left-[24px] md:left-[32px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] md:w-[44px] md:h-[44px] flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
                                aria-label="Decrease product count"
                            >
                                <svg width="20" height="2" viewBox="0 0 20 2" fill="none">
                                    <path d="M0 1H20" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>

                            {/* Animated Count */}
                            <AnimatedCount
                                value={productCount}
                                className="font-text text-[64px] md:text-[120px] font-normal text-white leading-none"
                            />

                            {/* Plus */}
                            <button
                                onClick={increment}
                                disabled={productCount >= config.maxProducts}
                                className="absolute right-[24px] md:right-[32px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] md:w-[44px] md:h-[44px] flex items-center justify-center rounded-full text-brand hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
                                aria-label="Increase product count"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0V20" stroke="currentColor" strokeWidth="2" />
                                    <path d="M0 10H20" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Deliverable Cards — same-height flex column */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-1 order-1 md:order-2">
                        {config.deliverables.map((deliverable) => (
                            <DeliverableCard
                                key={deliverable.id}
                                deliverable={deliverable}
                                active={!!activeDeliverables[deliverable.id]}
                                onToggle={() => toggleDeliverable(deliverable.id)}
                            />
                        ))}
                    </div>
                </div>


                {/* ── Results Row ── */}
                <div className="calc-v2-reveal flex flex-col md:flex-row items-start md:items-end justify-between gap-[32px] md:gap-12 pb-[16px] md:pb-0">

                    {/* Estimated delivery */}
                    <div className="flex flex-col gap-1 md:gap-5">
                        <span className="font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50">
                            {config.estimatedCostLabel}
                        </span>
                        {hasAnyDeliverable ? (
                            <AnimatedNumber
                                value={estimatedDays}
                                suffix={` ${config.deliveryUnit}`}
                                className="font-text text-[36px] md:text-[48px] text-white/60 leading-none"
                            />
                        ) : (
                            <span className="font-text text-[36px] md:text-[48px] text-white/20 leading-none">—</span>
                        )}
                    </div>

                    {/* Assets delivered */}
                    <div className="flex flex-col gap-1 md:gap-5">
                        <span className="font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50">
                            {config.assetsDeliveredLabel}
                        </span>
                        {hasAnyDeliverable ? (
                            <AnimatedNumber
                                value={totalAssets}
                                suffix={` ${config.assetsUnit}`}
                                className="font-text text-[36px] md:text-[48px] text-white/60 leading-none"
                            />
                        ) : (
                            <span className="font-text text-[36px] md:text-[48px] text-white/20 leading-none">—</span>
                        )}
                    </div>

                    {/* Total cost with discount */}
                    <div className="flex flex-col gap-1 md:gap-5">
                        <span className="font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50">
                            {config.totalCostLabel}
                            {progressiveDiscount > 0 && hasAnyDeliverable && (
                                <span className="text-brand ml-1">
                                    -{progressiveDiscount}%
                                </span>
                            )}
                        </span>
                        {hasAnyDeliverable ? (
                            <AnimatedNumber
                                value={estimatedCost}
                                prefix="$"
                                className={`font-heading text-[36px] md:text-[48px] font-bold ${progressiveDiscount > 0 ? "text-brand" : "text-white"} leading-none`}
                            />
                        ) : (
                            <span className="font-heading text-[36px] md:text-[48px] text-white/20 leading-none">—</span>
                        )}
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Button
                            size="large"
                            className="w-full md:w-auto md:min-w-[250px] h-[80px] md:h-[99px] text-[20px] md:text-[24px] rounded-full"
                            rightIcon={ArrowRight}
                            onClick={handleOpenContactForm}
                        >
                            {config.ctaLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
