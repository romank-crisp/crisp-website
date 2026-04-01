"use client";

import { useState, useMemo, useCallback } from "react";
import type { PriceCalculatorV2Data, DeliverableV2 } from "@/components/blocks/AIVisualPriceCalculator";

// ─── Helpers (duplicated from component to keep admin bundle separate) ───

function getStepForCount(count: number, tiers: { min: number; max: number; step: number }[]): number {
    for (const tier of tiers) {
        if (count >= tier.min && count <= tier.max) return tier.step;
    }
    return 1;
}

function getEfficiencyDivisor(count: number, tiers: { min: number; max: number; divisor: number }[]): number {
    for (const tier of tiers) {
        if (count >= tier.min && count <= tier.max) return tier.divisor;
    }
    return 1;
}

// ─── Component ──────────────────────────────────────────────────────────

interface Props {
    data: PriceCalculatorV2Data;
    onSave: (data: PriceCalculatorV2Data) => void;
}

const EDITOR_DEFAULTS: PriceCalculatorV2Data = {
    sectionTitle: "",
    productLabel: "",
    defaultPlaceholder: "",
    deliverables: [],
    incrementTiers: [],
    maxProducts: 100,
    minProducts: 5,
    efficiencyTiers: [],
    estimatedCostLabel: "",
    assetsDeliveredLabel: "",
    totalCostLabel: "",
    ctaLabel: "",
    ctaCaption: "",
    deliveryUnit: "",
    assetsUnit: "",
};

export function PriceCalculatorEditor({ data, onSave }: Props) {
    const [config, setConfig] = useState<PriceCalculatorV2Data>(() => ({
        ...EDITOR_DEFAULTS,
        ...data,
    }));
    const [testCount, setTestCount] = useState(config.minProducts ?? 5);
    const [testDeliverables, setTestDeliverables] = useState<Record<string, boolean>>(() => {
        const m: Record<string, boolean> = {};
        (config.deliverables ?? []).forEach((d) => { m[d.id] = true; });
        return m;
    });
    const [dirty, setDirty] = useState(false);

    // ── Update helpers ──
    const update = useCallback(<K extends keyof PriceCalculatorV2Data>(key: K, value: PriceCalculatorV2Data[K]) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setDirty(true);
    }, []);

    const updateDeliverable = useCallback((index: number, patch: Partial<DeliverableV2>) => {
        setConfig(prev => {
            const deliverables = [...prev.deliverables];
            deliverables[index] = { ...deliverables[index], ...patch };
            return { ...prev, deliverables };
        });
        setDirty(true);
    }, []);

    const addDeliverable = useCallback(() => {
        const id = `deliverable-${Date.now()}`;
        setConfig(prev => ({
            ...prev,
            deliverables: [...prev.deliverables, {
                id,
                label: "New Deliverable",
                basePrice: 50,
                baseDays: 1,
                media: "",
                defaultMedia: config.defaultPlaceholder ?? "",
                mediaType: "image" as const,
            }],
        }));
        setTestDeliverables(prev => ({ ...prev, [id]: true }));
        setDirty(true);
    }, [config.defaultPlaceholder]);

    const removeDeliverable = useCallback((index: number) => {
        setConfig(prev => {
            const deliverables = prev.deliverables.filter((_, i) => i !== index);
            return { ...prev, deliverables };
        });
        setDirty(true);
    }, []);

    // ── Calculations preview ──
    const activeList = useMemo(() =>
        config.deliverables.filter(d => testDeliverables[d.id]),
        [testDeliverables, config.deliverables]);

    const hasAny = activeList.length > 0;

    const totalAssets = useMemo(() => {
        if (!hasAny) return 0;
        const sumAssets = activeList.reduce((s, d) => s + (d.baseAssets ?? 10), 0);
        return testCount * sumAssets;
    }, [testCount, activeList, hasAny]);

    const progressiveDiscount = useMemo(() => {
        if (testCount <= 10) return 0;
        const countForDiscount = Math.min(testCount, 50);
        return Math.floor(countForDiscount / 5) * 5;
    }, [testCount]);

    const sumPrices = useMemo(() =>
        activeList.reduce((s, d) => s + d.basePrice, 0),
        [activeList]);

    const estimatedCost = useMemo(() => {
        if (!hasAny) return 0;
        const raw = testCount * sumPrices;
        return progressiveDiscount > 0
            ? Math.round(raw * (1 - progressiveDiscount / 100))
            : Math.round(raw);
    }, [testCount, sumPrices, hasAny, progressiveDiscount]);

    const sumDaysPerProduct = useMemo(() =>
        hasAny ? activeList.reduce((s, d) => s + d.baseDays, 0) : 0,
        [activeList, hasAny]);

    const estimatedDays = useMemo(() => {
        if (!hasAny) return 0;
        const divisor = getEfficiencyDivisor(testCount, config.efficiencyTiers);
        return Math.round((testCount * sumDaysPerProduct) / divisor);
    }, [testCount, config, sumDaysPerProduct, hasAny]);

    // ── Styles ──
    const label = "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1";
    const input = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white";
    const card = "bg-white rounded-xl border border-gray-200 p-5";
    const sectionTitle = "text-sm font-bold uppercase tracking-wider text-gray-400 mb-4";

    return (
        <div className="h-full overflow-y-auto p-6 bg-gray-50">

            {/* ── Save bar ── */}
            {dirty && (
                <div className="sticky top-0 z-20 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm mb-6">
                    <span className="text-sm text-blue-700 font-medium">You have unsaved changes</span>
                    <button
                        onClick={() => { onSave(config); setDirty(false); }}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                {/* ═══ LEFT COLUMN — Settings ═══ */}
                <div className="space-y-6">

                    {/* Pricing Parameters */}
                    <div className={card}>
                        <h3 className={sectionTitle}>General</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Min Products</label>
                                <input type="number" className={input} value={config.minProducts}
                                    onChange={e => update("minProducts", Number(e.target.value))} />
                            </div>
                            <div>
                                <label className={label}>Max Products</label>
                                <input type="number" className={input} value={config.maxProducts}
                                    onChange={e => update("maxProducts", Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    {/* Deliverables */}
                    <div className={card}>
                        <h3 className={sectionTitle}>Deliverables</h3>
                        <div className="space-y-3">
                            {config.deliverables.map((d, i) => (
                                <div key={d.id} className="border border-gray-100 rounded-lg px-4 py-3 bg-gray-50 flex flex-col gap-3">
                                    <span className="text-sm font-medium text-gray-700">{d.label}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">$</label>
                                            <input type="number" step="1" className={input} value={d.basePrice}
                                                onChange={e => updateDeliverable(i, { basePrice: Number(e.target.value) })} />
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">days</label>
                                            <input type="number" step="0.1" className={input} value={d.baseDays}
                                                onChange={e => updateDeliverable(i, { baseDays: Number(e.target.value) })} />
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">assets</label>
                                            <input type="number" step="1" className={input} value={d.baseAssets ?? 10}
                                                onChange={e => updateDeliverable(i, { baseAssets: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Increment Tiers */}
                    <div className={card}>
                        <h3 className={sectionTitle}>Increment Tiers</h3>
                        <div className="space-y-2">
                            {config.incrementTiers.map((tier, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className={label}>Min</label>
                                        <input type="number" className={input} value={tier.min}
                                            onChange={e => { const t = [...config.incrementTiers]; t[i] = { ...t[i], min: Number(e.target.value) }; update("incrementTiers", t); }} />
                                    </div>
                                    <div>
                                        <label className={label}>Max</label>
                                        <input type="number" className={input} value={tier.max}
                                            onChange={e => { const t = [...config.incrementTiers]; t[i] = { ...t[i], max: Number(e.target.value) }; update("incrementTiers", t); }} />
                                    </div>
                                    <div>
                                        <label className={label}>Step</label>
                                        <input type="number" className={input} value={tier.step}
                                            onChange={e => { const t = [...config.incrementTiers]; t[i] = { ...t[i], step: Number(e.target.value) }; update("incrementTiers", t); }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Efficiency Tiers */}
                    <div className={card}>
                        <h3 className={sectionTitle}>Efficiency Tiers</h3>
                        <div className="space-y-2">
                            {config.efficiencyTiers.map((tier, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className={label}>Min</label>
                                        <input type="number" className={input} value={tier.min}
                                            onChange={e => { const t = [...config.efficiencyTiers]; t[i] = { ...t[i], min: Number(e.target.value) }; update("efficiencyTiers", t); }} />
                                    </div>
                                    <div>
                                        <label className={label}>Max</label>
                                        <input type="number" className={input} value={tier.max}
                                            onChange={e => { const t = [...config.efficiencyTiers]; t[i] = { ...t[i], max: Number(e.target.value) }; update("efficiencyTiers", t); }} />
                                    </div>
                                    <div>
                                        <label className={label}>Divisor</label>
                                        <input type="number" step="0.1" className={input} value={tier.divisor}
                                            onChange={e => { const t = [...config.efficiencyTiers]; t[i] = { ...t[i], divisor: Number(e.target.value) }; update("efficiencyTiers", t); }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT COLUMN — Live Preview ═══ */}
                <div className="sticky top-6 self-start space-y-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5">
                            Live Calculation Preview
                        </h3>

                        {/* Test controls */}
                        <div className="space-y-4 mb-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                    Product Count
                                </label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setTestCount(c => Math.max(c - getStepForCount(c - 1, config.incrementTiers), config.minProducts))}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-lg">−</button>
                                    <span className="text-white text-2xl font-bold tabular-nums min-w-[3ch] text-center">{testCount}</span>
                                    <button onClick={() => setTestCount(c => Math.min(c + getStepForCount(c, config.incrementTiers), config.maxProducts))}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-lg">+</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                    Active Deliverables
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {config.deliverables.map(d => (
                                        <button key={d.id}
                                            onClick={() => setTestDeliverables(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${testDeliverables[d.id] ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400"
                                                }`}>
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Estimated Delivery</div>
                                <div className="text-white text-lg font-bold">{hasAny ? `${estimatedDays} ${config.deliveryUnit}` : "—"}</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Assets</div>
                                <div className="text-white text-lg font-bold">{hasAny ? `${totalAssets} ${config.assetsUnit}` : "—"}</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3 col-span-2">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center justify-between">
                                    <span>Total Cost</span>
                                    {progressiveDiscount > 0 && hasAny && (
                                        <span className="text-brand flex items-center gap-1 bg-brand/10 px-1.5 py-0.5 rounded-sm">
                                            -{progressiveDiscount}%
                                        </span>
                                    )}
                                </div>
                                <div className={`${progressiveDiscount > 0 ? "text-brand" : "text-white"} text-lg font-bold`}>{hasAny ? `$${estimatedCost.toLocaleString()}` : "—"}</div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="text-[11px] text-gray-500 space-y-1 border-t border-gray-800 pt-3">
                            <p>Cost: {testCount} × ${sumPrices}/product{progressiveDiscount > 0 ? ` × ${(1 - progressiveDiscount / 100).toFixed(2)}` : ""} = <strong className="text-white">${estimatedCost.toLocaleString()}</strong></p>
                            <p>Days: {testCount} × {sumDaysPerProduct}d ÷ {getEfficiencyDivisor(testCount, config.efficiencyTiers)} = <strong className="text-white">{estimatedDays} days</strong></p>
                            <p>Assets: {testCount} × {activeList.reduce((s, d) => s + (d.baseAssets ?? 10), 0)}/product = <strong className="text-white">{totalAssets} assets</strong></p>
                            <p>Step: <strong className="text-white">{getStepForCount(testCount, config.incrementTiers)}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
