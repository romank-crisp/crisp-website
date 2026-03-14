"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// Types & Config
// ---------------------------------------------------------------------------

export interface Deliverable {
    id: string;
    label: string;
    multiplier: number;
}

export interface IncrementTier {
    min: number;
    max: number;
    step: number;
}

export interface EfficiencyTier {
    min: number;
    max: number;
    divisor: number;
}

export interface PriceCalculatorData {
    sectionTitle: string;
    sectionSubtitle?: string;
    productLabel: string;
    deliverablesLabel: string;
    basePricePerProduct: number;
    deliverables: Deliverable[];
    incrementTiers: IncrementTier[];
    maxProducts: number;
    minProducts: number;
    discountPercent: number;
    baseDaysPerProduct: number;
    efficiencyTiers: EfficiencyTier[];
    estimatedCostLabel: string;
    estimatedDeliveryLabel: string;
    largeOrderMessage: string;
    largeOrderCta: string;
    deliveryUnit: string;
}

// Default configuration (used if no JSON data is provided)
const DEFAULT_CONFIG: PriceCalculatorData = {
    sectionTitle: "FAIR COST.<br/><span class='text-brand'>BULK<br/>DISCOUNTS.</span>",
    productLabel: "NUMBER OF PRODUCTS",
    deliverablesLabel: "DELIVERABLES FOR EACH PRODUCT",
    basePricePerProduct: 50,
    deliverables: [
        { id: "product-shots", label: "Product shots", multiplier: 1 },
        { id: "key-visual", label: "Art-directed key visual", multiplier: 1.5 },
        { id: "product-video", label: "10-sec product video", multiplier: 2 },
        { id: "campaign-assets", label: "Campaign ready assets", multiplier: 1.5 },
    ],
    incrementTiers: [
        { min: 1, max: 10, step: 1 },
        { min: 11, max: 50, step: 5 },
        { min: 51, max: 100, step: 10 },
    ],
    maxProducts: 100,
    minProducts: 5,
    discountPercent: 0,
    baseDaysPerProduct: 1,
    efficiencyTiers: [
        { min: 1, max: 5, divisor: 1 },
        { min: 6, max: 10, divisor: 0.75 },
        { min: 11, max: 20, divisor: 2 },
        { min: 21, max: 50, divisor: 3 },
        { min: 51, max: 100, divisor: 4 },
    ],
    estimatedCostLabel: "Estimated package cost",
    estimatedDeliveryLabel: "Estimated delivery",
    largeOrderMessage: "Special price",
    largeOrderCta: "Request custom quote",
    deliveryUnit: "production days",
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

function calculateAssetNodeCount(productCount: number, activeDeliverables: Record<string, boolean>) {
    let count = productCount;
    const hasShots = activeDeliverables["product-shots"] ?? false;
    const hasVideo = activeDeliverables["product-video"] ?? false;
    const hasKeyVisual = activeDeliverables["key-visual"] ?? false;
    const hasCampaign = activeDeliverables["campaign-assets"] ?? false;

    let perProduct = 0;
    if (hasShots) {
        perProduct += 2;
        if (hasVideo) perProduct += 1; // Actually, looking at generateGraph: Shot A gets video. So +1 video per product. wait! let's check generateGraph again.
        if (hasKeyVisual) {
            perProduct += 1; // Shot B gets KV.
            if (hasCampaign) perProduct += 2; // Campaign A+B for KV.
        }
    } else {
        if (hasVideo) perProduct += 1;
        if (hasKeyVisual) {
            perProduct += 1;
            if (hasCampaign) perProduct += 2;
        } else if (hasCampaign) {
            perProduct += 2;
        }
    }
    return count + count * perProduct;
}

// ---------------------------------------------------------------------------
// Network Graph
// ---------------------------------------------------------------------------

interface GraphNode {
    id: string;
    x: number;
    y: number;
    r: number;
    opacity: number;
    tier: number;
    // 0 = Image (parent)
    // 1 = Product Shot
    // 2 = Product Video
    // 3 = Key Visual
    // 4 = Campaign Asset
}

interface GraphEdge {
    from: string;
    to: string;
}

/**
 * Tree per "Image N" parent:
 *
 * ─ Image N
 *   └─ Shot A          (if product-shots)
 *   │  └─ Video        (if product-video)
 *   └─ Shot B          (if product-shots)
 *      └─ Key Visual   (if key-visual)
 *         └─ Campaign A (if campaign-assets)
 *         └─ Campaign B (if campaign-assets)
 */
function generateGraph(
    productCount: number,
    activeDeliverables: Record<string, boolean>,
    width: number,
    height: number,
): { nodes: GraphNode[]; edges: GraphEdge[]; nodeCount: number } {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const hasShots = activeDeliverables["product-shots"] ?? false;
    const hasVideo = activeDeliverables["product-video"] ?? false;
    const hasKeyVisual = activeDeliverables["key-visual"] ?? false;
    const hasCampaign = activeDeliverables["campaign-assets"] ?? false;

    // Distribute on a full circle, positioned in the left half of the section
    const arcRadius = Math.min(width * 0.22, height * 0.35);
    const centerX = Math.max(width * 0.25, arcRadius + 80); // Center roughly in left column
    const centerY = height * 0.55; // Slightly below center so title doesn't overlap

    const startAngle = -Math.PI / 2; // start from top (12 o'clock)
    const sweepAngle = Math.PI * 2;   // full 360 circle

    // Branch distance
    const branchLen = Math.max(35, Math.min(60, arcRadius * 0.25));
    const baseR = Math.min(7, Math.max(3, 24 / Math.sqrt(productCount)));

    for (let i = 0; i < productCount; i++) {
        // Spread nodes evenly along the full circle (avoid overlapping start/end state)
        const t = productCount > 0 ? i / productCount : 0;
        const angle = startAngle + t * sweepAngle;
        const px = centerX + Math.cos(angle) * arcRadius;
        const py = centerY + Math.sin(angle) * arcRadius;

        // Outward direction from center (used to radiate children)
        const outX = Math.cos(angle);
        const outY = Math.sin(angle);
        // Tangent direction (perpendicular, for spreading children)
        const tanX = -Math.sin(angle);
        const tanY = Math.cos(angle);

        const parentId = `img-${i}`;
        nodes.push({
            id: parentId,
            x: px,
            y: py,
            r: baseR,
            opacity: 0.7,
            tier: 0,
        });

        // Connect parents along the arc sequentially
        if (i > 0) {
            edges.push({ from: `img-${i - 1}`, to: parentId });
        }

        if (hasShots) {
            // Shot A: outward + left tangent
            const saX = px + outX * branchLen + tanX * branchLen * 0.4;
            const saY = py + outY * branchLen + tanY * branchLen * 0.4;
            const shotAId = `sa-${i}`;
            nodes.push({ id: shotAId, x: saX, y: saY, r: baseR * 0.75, opacity: 0.5, tier: 1 });
            edges.push({ from: parentId, to: shotAId });

            // Shot A → Video (further outward-left)
            if (hasVideo) {
                const videoId = `vid-${i}`;
                const vX = saX + outX * branchLen * 0.7 + tanX * branchLen * 0.3;
                const vY = saY + outY * branchLen * 0.7 + tanY * branchLen * 0.3;
                nodes.push({ id: videoId, x: vX, y: vY, r: baseR * 0.6, opacity: 0.35, tier: 2 });
                edges.push({ from: shotAId, to: videoId });
            }

            // Shot B: outward + right tangent
            const sbX = px + outX * branchLen - tanX * branchLen * 0.4;
            const sbY = py + outY * branchLen - tanY * branchLen * 0.4;
            const shotBId = `sb-${i}`;
            nodes.push({ id: shotBId, x: sbX, y: sbY, r: baseR * 0.75, opacity: 0.5, tier: 1 });
            edges.push({ from: parentId, to: shotBId });

            // Shot B → Key Visual (further outward-right)
            if (hasKeyVisual) {
                const kvX = sbX + outX * branchLen * 0.7 - tanX * branchLen * 0.3;
                const kvY = sbY + outY * branchLen * 0.7 - tanY * branchLen * 0.3;
                const kvId = `kv-${i}`;
                nodes.push({ id: kvId, x: kvX, y: kvY, r: baseR * 0.6, opacity: 0.35, tier: 3 });
                edges.push({ from: shotBId, to: kvId });

                // Key Visual → Campaign A, B
                if (hasCampaign) {
                    const caX = kvX + outX * branchLen * 0.5 + tanX * branchLen * 0.25;
                    const caY = kvY + outY * branchLen * 0.5 + tanY * branchLen * 0.25;
                    nodes.push({ id: `ca-${i}`, x: caX, y: caY, r: baseR * 0.5, opacity: 0.25, tier: 4 });
                    edges.push({ from: kvId, to: `ca-${i}` });

                    const cbX = kvX + outX * branchLen * 0.5 - tanX * branchLen * 0.25;
                    const cbY = kvY + outY * branchLen * 0.5 - tanY * branchLen * 0.25;
                    nodes.push({ id: `cb-${i}`, x: cbX, y: cbY, r: baseR * 0.5, opacity: 0.25, tier: 4 });
                    edges.push({ from: kvId, to: `cb-${i}` });
                }
            }
        } else {
            // No shots: branch deliverables directly outward from parent
            let step = 0;
            const total = [hasVideo, hasKeyVisual, hasCampaign].filter(Boolean).length;
            const spread = total > 1 ? branchLen * 0.5 : 0;

            if (hasVideo) {
                const off = (step - (total - 1) / 2) * spread;
                const vX = px + outX * branchLen + tanX * off;
                const vY = py + outY * branchLen + tanY * off;
                nodes.push({ id: `vid-${i}`, x: vX, y: vY, r: baseR * 0.7, opacity: 0.4, tier: 2 });
                edges.push({ from: parentId, to: `vid-${i}` });
                step++;
            }

            if (hasKeyVisual) {
                const off = (step - (total - 1) / 2) * spread;
                const kvX = px + outX * branchLen + tanX * off;
                const kvY = py + outY * branchLen + tanY * off;
                const kvId = `kv-${i}`;
                nodes.push({ id: kvId, x: kvX, y: kvY, r: baseR * 0.7, opacity: 0.4, tier: 3 });
                edges.push({ from: parentId, to: kvId });

                if (hasCampaign) {
                    const caX = kvX + outX * branchLen * 0.6 + tanX * branchLen * 0.2;
                    const caY = kvY + outY * branchLen * 0.6 + tanY * branchLen * 0.2;
                    nodes.push({ id: `ca-${i}`, x: caX, y: caY, r: baseR * 0.5, opacity: 0.3, tier: 4 });
                    edges.push({ from: kvId, to: `ca-${i}` });

                    const cbX = kvX + outX * branchLen * 0.6 - tanX * branchLen * 0.2;
                    const cbY = kvY + outY * branchLen * 0.6 - tanY * branchLen * 0.2;
                    nodes.push({ id: `cb-${i}`, x: cbX, y: cbY, r: baseR * 0.5, opacity: 0.3, tier: 4 });
                    edges.push({ from: kvId, to: `cb-${i}` });
                }
                step++;
            } else if (hasCampaign) {
                const off = (step - (total - 1) / 2) * spread;
                const caX = px + outX * branchLen + tanX * (off - branchLen * 0.2);
                const caY = py + outY * branchLen + tanY * (off - branchLen * 0.2);
                nodes.push({ id: `ca-${i}`, x: caX, y: caY, r: baseR * 0.6, opacity: 0.35, tier: 4 });
                edges.push({ from: parentId, to: `ca-${i}` });

                const cbX = px + outX * branchLen + tanX * (off + branchLen * 0.2);
                const cbY = py + outY * branchLen + tanY * (off + branchLen * 0.2);
                nodes.push({ id: `cb-${i}`, x: cbX, y: cbY, r: baseR * 0.6, opacity: 0.35, tier: 4 });
                edges.push({ from: parentId, to: `cb-${i}` });
            }
        }
    }

    return { nodes, edges, nodeCount: nodes.length };
}

/** Tier-based node colors — shades of grey */
const TIER_COLORS = [
    "rgba(255,255,255,0.7)",   // 0 — Image (parent)
    "rgba(255,255,255,0.5)",   // 1 — Product Shot
    "rgba(255,255,255,0.35)",  // 2 — Product Video
    "rgba(255,255,255,0.25)",  // 3 — Key Visual
    "rgba(255,255,255,0.18)",  // 4 — Campaign Asset
];

/** SVG network graph that reacts to calculator state */
function NetworkGraph({
    productCount,
    activeDeliverables,
}: {
    productCount: number;
    activeDeliverables: Record<string, boolean>;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

    useEffect(() => {
        const updateSize = () => {
            if (svgRef.current?.parentElement) {
                const rect = svgRef.current.parentElement.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const { nodes, edges, nodeCount } = useMemo(
        () => generateGraph(productCount, activeDeliverables, dimensions.width, dimensions.height),
        [productCount, activeDeliverables, dimensions],
    );

    const nodeMap = useMemo(() => {
        const map: Record<string, GraphNode> = {};
        for (const n of nodes) map[n.id] = n;
        return map;
    }, [nodes]);

    return (
        <div className="relative w-full h-full">
            <svg
                ref={svgRef}
                className="w-full h-full pointer-events-none select-none"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Edges */}
                <AnimatePresence>
                    {edges.map((edge) => {
                        const from = nodeMap[edge.from];
                        const to = nodeMap[edge.to];
                        if (!from || !to) return null;
                        return (
                            <motion.line
                                key={`${edge.from}-${edge.to}`}
                                initial={{ opacity: 0 }}
                                animate={{
                                    x1: from.x,
                                    y1: from.y,
                                    x2: to.x,
                                    y2: to.y,
                                    opacity: Math.min(from.opacity, to.opacity) * 0.5,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth={1}
                            />
                        );
                    })}
                </AnimatePresence>

                {/* Nodes */}
                <AnimatePresence>
                    {nodes.map((node) => (
                        <motion.circle
                            key={node.id}
                            initial={{ r: 0, opacity: 0, cx: node.x, cy: node.y }}
                            animate={{
                                cx: node.x,
                                cy: node.y,
                                r: node.r,
                                opacity: node.opacity,
                            }}
                            exit={{ r: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            fill={TIER_COLORS[node.tier] ?? TIER_COLORS[0]}
                        />
                    ))}
                </AnimatePresence>
            </svg>
        </div>
    );
}


// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Toggle switch matching the Figma design — pill shape with sliding circle */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
                relative w-[56px] h-[30px] rounded-full transition-colors duration-300 flex-shrink-0
                ${checked
                    ? "bg-brand"
                    : "bg-white/15"
                }
            `}
        >
            <motion.span
                className="absolute top-[3px] block w-[24px] h-[24px] rounded-full bg-white shadow-lg"
                animate={{ left: checked ? 29 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );
}

/** Animated number display that counts up/down */
function AnimatedPrice({ value, prefix = "$", highlight = false }: { value: number; prefix?: string; highlight?: boolean }) {
    const ref = useRef<HTMLSpanElement>(null);
    const prevValue = useRef(value);

    useGSAP(() => {
        if (!ref.current) return;
        const obj = { val: prevValue.current };
        gsap.to(obj, {
            val: value,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                if (ref.current) {
                    ref.current.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}`;
                }
            },
        });
        prevValue.current = value;
    }, { dependencies: [value] });

    return (
        <span ref={ref} className={`font-heading text-[64px] md:text-[80px] font-bold leading-none tracking-tight transition-colors duration-300 ${highlight ? 'text-brand' : 'text-white'}`}>
            {prefix}{value.toLocaleString()}
        </span>
    );
}

/** Animated day count */
function AnimatedDays({ value, unit }: { value: number; unit: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const prevValue = useRef(value);

    useGSAP(() => {
        if (!ref.current) return;
        const obj = { val: prevValue.current };
        gsap.to(obj, {
            val: value,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                if (ref.current) {
                    ref.current.textContent = `~${Math.round(obj.val)} ${unit}`;
                }
            },
        });
        prevValue.current = value;
    }, { dependencies: [value] });

    return (
        <span ref={ref} className="font-text text-text-md text-white/70 leading-none">
            ~{value} {unit}
        </span>
    );
}

/** Animated volume count */
function AnimatedVolume({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const prevValue = useRef(value);

    useGSAP(() => {
        if (!ref.current) return;
        const obj = { val: prevValue.current };
        gsap.to(obj, {
            val: value,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                if (ref.current) {
                    ref.current.textContent = `${Math.round(obj.val)} visual assets`;
                }
            },
        });
        prevValue.current = value;
    }, { dependencies: [value] });

    return (
        <span ref={ref} className="font-text text-text-md text-white/70 leading-none">
            {value} visual assets
        </span>
    );
}


// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface AIVisualPriceCalculatorProps {
    data?: PriceCalculatorData;
}

export function AIVisualPriceCalculator({ data }: AIVisualPriceCalculatorProps) {
    const config = data ?? DEFAULT_CONFIG;
    const sectionRef = useRef<HTMLElement>(null);
    const minProducts = config.minProducts ?? 5;

    // --- State ---
    const [productCount, setProductCount] = useState(minProducts);
    const [activeDeliverables, setActiveDeliverables] = useState<Record<string, boolean>>(() => {
        // Default: first deliverable is ON
        const initial: Record<string, boolean> = {};
        config.deliverables.forEach((d, i) => {
            initial[d.id] = i === 0;
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

    // --- Calculations ---
    const totalAssetNodes = useMemo(() => calculateAssetNodeCount(productCount, activeDeliverables), [productCount, activeDeliverables]);

    const deliverableMultiplier = useMemo(() => {
        return config.deliverables.reduce((sum, d) => {
            return sum + (activeDeliverables[d.id] ? d.multiplier : 0);
        }, 0);
    }, [activeDeliverables, config.deliverables]);

    const isLargeOrder = productCount >= config.maxProducts;
    const hasAnyDeliverable = deliverableMultiplier > 0;

    // Progressive discount: kicks in above 10 products
    // Linear from 20% at 11 products to 50% at 99 products
    const progressiveDiscount = useMemo(() => {
        if (productCount <= 10) return 0;
        // Linear interpolation: 20% at 11, 50% at 99
        const t = Math.min((productCount - 11) / (99 - 11), 1);
        return Math.round(20 + t * 30);
    }, [productCount]);

    const estimatedCost = useMemo(() => {
        if (!hasAnyDeliverable) return 0;
        const raw = productCount * config.basePricePerProduct * deliverableMultiplier;
        return progressiveDiscount > 0
            ? Math.round(raw * (1 - progressiveDiscount / 100))
            : raw;
    }, [productCount, config, deliverableMultiplier, hasAnyDeliverable, progressiveDiscount]);

    const estimatedDays = useMemo(() => {
        const divisor = getEfficiencyDivisor(productCount, config.efficiencyTiers);
        return Math.round((productCount * config.baseDaysPerProduct) / divisor);
    }, [productCount, config]);

    // --- Contact form integration ---
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
    }, [productCount, activeDeliverables, config, openContactFormWithData]);

    // --- GSAP entrance animation ---
    useGSAP(() => {
        if (!sectionRef.current) return;
        const els = sectionRef.current.querySelectorAll(".calc-reveal");
        gsap.fromTo(els,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="w-full bg-text text-white overflow-hidden relative min-h-screen flex items-center"
        >
            {/* Graph layer — sits behind everything, full height */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <NetworkGraph
                        productCount={productCount}
                        activeDeliverables={activeDeliverables}
                    />
                </div>
            </div>

            {/* Top area: 2-column layout — title + form, transparent bg so graph shows through */}
            <div className="w-full max-w-[1475px] mx-auto px-6 md:px-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-48 py-12">
                {/* Left column: Title */}
                <div className="md:w-[45%] flex-shrink-0">
                    <h2
                        className="calc-reveal font-mega text-mega-h2 uppercase text-white leading-[0.85] tracking-tight"
                        dangerouslySetInnerHTML={{ __html: config.sectionTitle }}
                    />
                </div>

                {/* Right column: Calculator form — transparent background */}
                <div className="md:w-[50%] lg:w-[40%] w-full calc-reveal">
                    {/* Product Counter Row */}
                    <div className="border-t border-white/10 py-12">
                        <div className="flex items-center justify-between">
                            <span className="font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50">
                                {config.productLabel}
                            </span>
                            <div className="flex items-center gap-4 md:gap-6">
                                {/* Minus */}
                                <button
                                    onClick={decrement}
                                    disabled={productCount <= minProducts}
                                    className="w-[44px] h-[44px] flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    aria-label="Decrease product count"
                                >
                                    <svg width="20" height="2" viewBox="0 0 20 2" fill="none">
                                        <path d="M0 1H20" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>

                                {/* Count Display */}
                                <motion.span
                                    key={productCount}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-heading text-[48px] md:text-[56px] font-medium text-white leading-none tabular-nums min-w-[80px] text-center"
                                >
                                    {productCount}
                                </motion.span>

                                {/* Plus */}
                                <button
                                    onClick={increment}
                                    disabled={productCount >= config.maxProducts}
                                    className="w-[44px] h-[44px] flex items-center justify-center rounded-full text-brand hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    aria-label="Increase product count"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 0V20" stroke="currentColor" strokeWidth="2" />
                                        <path d="M0 10H20" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Deliverables Section */}
                    <div className="border-t border-white/10 py-6">
                        <span className="font-heading text-[11px] md:text-[13px] tracking-[2px] uppercase text-white/50 block mb-4">
                            {config.deliverablesLabel}
                        </span>
                        <div className="flex flex-col">
                            {config.deliverables.map((deliverable) => (
                                <div key={deliverable.id} className="flex flex-col">
                                    <div className="flex items-center justify-between py-3 group">
                                        <span
                                            className={`font-text text-text-md transition-colors duration-300 ${activeDeliverables[deliverable.id]
                                                ? "text-white"
                                                : "text-white/40"
                                                }`}
                                        >
                                            {deliverable.label}
                                        </span>
                                        <Toggle
                                            checked={!!activeDeliverables[deliverable.id]}
                                            onChange={() => toggleDeliverable(deliverable.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Results Section */}
                    <div className="border-t border-white/10 pt-16 pb-8">
                        <AnimatePresence mode="wait">
                            {isLargeOrder ? (
                                /* Large order CTA */
                                <motion.div
                                    key="large-order"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                                >
                                    <span className="font-heading text-h3 font-bold text-white">
                                        {config.largeOrderMessage}
                                    </span>
                                    <a
                                        href="#contact"
                                        className="px-8 py-4 bg-brand text-white font-heading font-bold text-[14px] tracking-[1px] uppercase rounded-full hover:bg-white hover:text-[#120c2a] transition-all duration-300"
                                    >
                                        {config.largeOrderCta}
                                    </a>
                                </motion.div>
                            ) : (
                                /* Normal price display */
                                <motion.div
                                    key="price-display"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-12"
                                >
                                    {/* Cost row */}
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div>
                                            <span className="font-heading text-[11px] md:text-[13px] uppercase tracking-[2px] text-white/50 block leading-none">
                                                {config.estimatedCostLabel}
                                            </span>
                                            <AnimatePresence>
                                                {progressiveDiscount > 0 && hasAnyDeliverable && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="font-heading text-[11px] md:text-[13px] uppercase tracking-[2px] text-brand mt-4 block"
                                                    >
                                                        {progressiveDiscount}% discount
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {hasAnyDeliverable ? (
                                            <AnimatedPrice value={estimatedCost} highlight={progressiveDiscount > 0} />
                                        ) : (
                                            <span className="font-heading text-[64px] md:text-[80px] text-white/30 leading-none">
                                                —
                                            </span>
                                        )}
                                    </div>

                                    {/* Delivery row */}
                                    <div className="flex flex-row items-center justify-between gap-4 pt-6">
                                        <span className="font-heading text-[11px] md:text-[13px] uppercase tracking-[2px] text-white/50 block leading-none">
                                            {config.estimatedDeliveryLabel}
                                        </span>
                                        {hasAnyDeliverable ? (
                                            <AnimatedDays value={estimatedDays} unit={config.deliveryUnit} />
                                        ) : (
                                            <span className="font-text text-text-md text-white/20">
                                                —
                                            </span>
                                        )}
                                    </div>

                                    {/* Volume row */}
                                    <div className="flex flex-row items-center justify-between gap-4 pt-6">
                                        <span className="font-heading text-[11px] md:text-[13px] uppercase tracking-[2px] text-white/50 block leading-none">
                                            Estimated package volume
                                        </span>
                                        {hasAnyDeliverable ? (
                                            <AnimatedVolume value={totalAssetNodes} />
                                        ) : (
                                            <span className="font-text text-text-md text-white/20">
                                                —
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Full-width CTA button */}
                    <div className="pt-8">
                        <Button
                            size="large"
                            className="w-full"
                            rightIcon={ArrowRight}
                            onClick={handleOpenContactForm}
                        >
                            Get a quote
                        </Button>
                    </div>
                </div>
            </div>

            {/* Spacer for the graph area below the content */}
            <div className="relative z-0" style={{ height: '45vh' }} />
        </section>
    );
}
