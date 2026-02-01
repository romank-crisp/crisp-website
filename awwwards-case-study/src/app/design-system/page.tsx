"use client";

import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layouts/Navbar";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { ArrowRight, Mail, Plus } from "lucide-react";

const ComponentBlock = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div className="flex flex-col items-center gap-12 group">
        <div className="flex items-center justify-center p-12 min-h-[100px] w-full bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
            {children}
        </div>
        <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-30 group-hover:opacity-100 transition-opacity">
            {label}
        </span>
    </div>
);

export default function DesignSystemPage() {
    return (
        <main className="min-h-screen bg-white text-text p-32 md:p-64 pt-160">
            <Navbar isHidden={false} />

            <div className="h-[50vh] flex flex-col justify-end pb-32 mb-64 border-b border-text/10">
                <h1 className="font-mega text-mega-h2 leading-[0.8] uppercase">Design System</h1>
                <p className="font-text text-text-md opacity-60 mt-8 max-w-xl">
                    Collection of reusable UI components, typography, and colors based on Figma tokens.
                    Serves as the single source of truth for the Crisp Studio website.
                </p>
            </div>

            <section className="space-y-64">
                {/* Colors Section */}
                <div className="space-y-48">
                    <h2 className="font-heading text-h2 uppercase tracking-widest text-brand">Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-32">
                        {/* Brand */}
                        <div className="space-y-12">
                            <div className="w-full h-80 bg-brand rounded-2xl border border-black/5" />
                            <div className="space-y-4">
                                <h3 className="font-heading text-h4 font-bold">Brand</h3>
                                <p className="font-text text-sm opacity-50 font-mono">var(--color-brand)</p>
                            </div>
                        </div>
                        {/* Text */}
                        <div className="space-y-12">
                            <div className="w-full h-80 bg-text rounded-2xl border border-black/5" />
                            <div className="space-y-4">
                                <h3 className="font-heading text-h4 font-bold">Text (Dark)</h3>
                                <p className="font-text text-sm opacity-50 font-mono">var(--color-text)</p>
                            </div>
                        </div>
                        {/* White */}
                        <div className="space-y-12">
                            <div className="w-full h-80 bg-white rounded-2xl border border-black/10" />
                            <div className="space-y-4">
                                <h3 className="font-heading text-h4 font-bold">White</h3>
                                <p className="font-text text-sm opacity-50 font-mono">var(--color-white)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography Section */}
                <div className="space-y-48">
                    <h2 className="font-heading text-h2 uppercase tracking-widest text-brand">Typography</h2>
                    <div className="space-y-48">
                        {/* Mega Headers */}
                        <div className="space-y-24 border-b border-text/10 pb-32">
                            <div className="flex flex-col gap-12">
                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">Mega H1</span>
                                <h1 className="font-mega text-mega-h1 leading-none">Crisp Studio</h1>
                            </div>
                            <div className="flex flex-col gap-12">
                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">Mega H2</span>
                                <h2 className="font-mega text-mega-h2 leading-none">Creative Digital</h2>
                            </div>
                        </div>

                        {/* Standard Headers */}
                        <div className="space-y-24 border-b border-text/10 pb-32">
                            <div className="grid gap-24">
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">H1</span>
                                    <h1 className="font-heading text-h1">The quick brown fox jumps</h1>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">H2</span>
                                    <h2 className="font-heading text-h2">The quick brown fox jumps</h2>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">H3</span>
                                    <h3 className="font-heading text-h3">The quick brown fox jumps over the lazy dog</h3>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">H4</span>
                                    <h4 className="font-heading text-h4">The quick brown fox jumps over the lazy dog</h4>
                                </div>
                            </div>
                        </div>

                        {/* Body Text */}
                        <div className="space-y-24">
                            <div className="grid gap-24">
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">Body Large</span>
                                    <p className="font-text text-text-lg">The quick brown fox jumps over the lazy dog. A clear and readable large text style.</p>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">Body Medium</span>
                                    <p className="font-text text-text-md">The quick brown fox jumps over the lazy dog. This is the standard body text used for most content paragraphs.</p>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">Body Small</span>
                                    <p className="font-text text-text-sm">The quick brown fox jumps over the lazy dog. Used for captions, labels, and secondary information.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Button Section */}
                <div className="space-y-48">
                    <h2 className="font-heading text-h2 uppercase tracking-widest text-brand">Buttons</h2>

                    <div className="grid gap-48">
                        {/* Variant: Filled */}
                        <div className="space-y-16">
                            <h3 className="font-heading text-h4 opacity-50 uppercase">Filled (Brand)</h3>
                            <div className="flex flex-wrap items-end gap-24">
                                <ComponentBlock label="Filled / Large">
                                    <Button size="large" rightIcon={ArrowRight}>Discuss a project</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Filled / Medium">
                                    <Button size="medium" rightIcon={ArrowRight}>Discuss a project</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Filled / Small">
                                    <Button size="small" rightIcon={ArrowRight}>Discuss a project</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Filled / Custom Icon">
                                    <Button size="medium" leftIcon={Mail}>Send Email</Button>
                                </ComponentBlock>
                            </div>
                        </div>

                        {/* Variant: Outline */}
                        <div className="space-y-16">
                            <h3 className="font-heading text-h4 opacity-50 uppercase">Outline</h3>
                            <div className="flex flex-wrap items-end gap-24">
                                <ComponentBlock label="Outline / Medium">
                                    <Button variant="outline" size="medium" leftIcon={Plus}>Add Item</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Outline / Small">
                                    <Button variant="outline" size="small">No Icon</Button>
                                </ComponentBlock>
                            </div>
                        </div>

                        {/* Variant: Disabled States */}
                        <div className="space-y-16">
                            <h3 className="font-heading text-h4 opacity-50 uppercase">Disabled States</h3>
                            <div className="flex flex-wrap items-end gap-24">
                                <ComponentBlock label="Filled / Disabled">
                                    <Button size="medium" disabled rightIcon={ArrowRight}>Button Locked</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Outline / Disabled">
                                    <Button variant="outline" size="medium" disabled>Outline Locked</Button>
                                </ComponentBlock>
                                <ComponentBlock label="Transparent / Disabled">
                                    <Button variant="transparent" size="medium" disabled>Hidden State</Button>
                                </ComponentBlock>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inputs Section */}
                <div className="space-y-48">
                    <h2 className="font-heading text-h2 uppercase tracking-widest text-brand">Inputs & Selects</h2>

                    <div className="grid md:grid-cols-2 gap-64 max-w-[1000px]">
                        {/* Inputs */}
                        <div className="space-y-32">
                            <h3 className="font-heading text-h4 opacity-50 uppercase border-b border-text/10 pb-16">Text Inputs</h3>

                            <div className="grid gap-32">
                                <ComponentBlock label="Large / Filled">
                                    <Input label="Company Name" placeholder="Enter company name..." sizeVariant="large" className="w-full" />
                                </ComponentBlock>
                                <ComponentBlock label="Default / Medium">
                                    <Input label="Project Name" placeholder="Enter project name..." sizeVariant="medium" className="w-full" />
                                </ComponentBlock>
                                <ComponentBlock label="Default / Small">
                                    <Input label="Email" placeholder="your@email.com" sizeVariant="small" className="w-full" />
                                </ComponentBlock>
                                <ComponentBlock label="Error State">
                                    <Input
                                        label="Error State"
                                        defaultValue="Invalid entry"
                                        variant="error"
                                        title="Please enter a valid value"
                                        className="w-full"
                                    />
                                </ComponentBlock>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="space-y-32">
                            <h3 className="font-heading text-h4 opacity-50 uppercase border-b border-text/10 pb-16">Dropdowns</h3>

                            <div className="grid gap-32">
                                <ComponentBlock label="Large / Filled">
                                    <Dropdown
                                        label="Industry"
                                        placeholder="Select industry"
                                        sizeVariant="large"
                                        className="w-full"
                                        options={[
                                            { label: "Technology", value: "tech" },
                                            { label: "Healthcare", value: "health" },
                                            { label: "Finance", value: "finance" },
                                        ]}
                                    />
                                </ComponentBlock>
                                <ComponentBlock label="Dropdown / Medium">
                                    <Dropdown
                                        label="Service Type"
                                        placeholder="Choose service"
                                        sizeVariant="medium"
                                        className="w-full"
                                        options={[
                                            { label: "Web Design", value: "design" },
                                            { label: "Development", value: "dev" },
                                            { label: "Branding", value: "branding" },
                                        ]}
                                    />
                                </ComponentBlock>

                                <ComponentBlock label="Dropdown / Small">
                                    <Dropdown
                                        label="Budget Range"
                                        placeholder="Select budget"
                                        sizeVariant="small"
                                        className="w-full"
                                        options={[
                                            { label: "$5k - $10k", value: "low" },
                                            { label: "$10k - $25k", value: "mid" },
                                            { label: "$25k+", value: "high" },
                                        ]}
                                    />
                                </ComponentBlock>

                                <ComponentBlock label="Dropdown / Error">
                                    <Dropdown
                                        label="Error State"
                                        variant="error"
                                        options={[]}
                                        placeholder="Error in selection"
                                        className="w-full"
                                    />
                                </ComponentBlock>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

