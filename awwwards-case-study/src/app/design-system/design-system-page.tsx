"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layouts/Navbar";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight, Mail, Plus } from "lucide-react";
import { clsx } from "clsx";

const ComponentBlock = ({
    children,
    label,
    classNameDisplay
}: {
    children: React.ReactNode;
    label: string;
    classNameDisplay?: string;
}) => (
    <div className="flex flex-col items-center gap-12 group w-full">
        <div className="flex items-center justify-center p-12 min-h-[120px] w-full bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors border border-black/5">
            {children}
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-40">
                {label}
            </span>
            {classNameDisplay && (
                <code className="text-[10px] font-mono text-brand bg-brand/5 px-6 py-2 rounded">
                    {classNameDisplay}
                </code>
            )}
        </div>
    </div>
);

const SpacingBlock = ({ size, value }: { size: string, value: string }) => (
    <div className="flex flex-col gap-12 group">
        <div className="h-64 bg-gray-50 rounded-xl flex items-center p-12 relative overflow-hidden">
            <div
                className="bg-brand h-16 rounded-full"
                style={{ width: `var(--space-${size})` }}
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 font-mono text-xs opacity-30">
                {value}
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold opacity-40">
                Space {size}
            </span>
            <code className="text-[10px] font-mono text-brand bg-brand/5 px-6 py-2 rounded w-fit">
                var(--space-{size})
            </code>
        </div>
    </div>
);

export default function DesignSystemPage() {
    const [activeTab, setActiveTab] = useState("colors");

    const tabs = [
        { label: "Colors", value: "colors" },
        { label: "Typography", value: "typography" },
        { label: "Spacing", value: "spacing" },
        { label: "Buttons", value: "buttons" },
        { label: "Inputs", value: "inputs" },
        { label: "Tags", value: "tags" },
    ];

    return (
        <main className="min-h-screen bg-white text-text p-32 md:p-64 pt-160">


            <div className="flex flex-col gap-32 mb-64 border-b border-text/10 pb-32">
                <div>
                    <h1
                        className="font-mega text-mega-h1 uppercase mb-8 text-brand"
                        style={{
                            WebkitTextStrokeWidth: '4px',
                            WebkitTextStrokeColor: 'currentColor',
                        }}
                    >
                        Design<br />System
                    </h1>
                    <p className="font-text text-xl md:text-2xl opacity-60 max-w-2xl">
                        A comprehensive guide to our visual language, components, and interaction patterns.
                    </p>
                </div>

                <Tabs
                    items={tabs}
                    activeValue={activeTab}
                    onChange={setActiveTab}
                    className="w-fit"
                />
            </div>

            <section className="min-h-[50vh]">
                {/* Colors Section */}
                {activeTab === "colors" && (
                    <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                )}

                {/* Typography Section */}
                {activeTab === "typography" && (
                    <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-48">
                            {/* Mega Headers */}
                            <div className="space-y-24 border-b border-text/10 pb-32">
                                <div className="flex flex-col gap-12">
                                    <div className="flex items-center gap-12 mb-4">
                                        <span className="font-text text-sm opacity-40 uppercase tracking-widest">Mega H1</span>
                                        <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">font-mega text-mega-h1</code>
                                    </div>
                                    <h1
                                        className="font-mega text-mega-h1 uppercase text-brand"
                                        style={{
                                            WebkitTextStrokeWidth: '4px',
                                            WebkitTextStrokeColor: 'currentColor',
                                        }}
                                    >
                                        Bold Stuff
                                    </h1>
                                </div>
                                <div className="flex flex-col gap-12">
                                    <div className="flex items-center gap-12 mb-4">
                                        <span className="font-text text-sm opacity-40 uppercase tracking-widest">Mega H2</span>
                                        <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">font-mega text-mega-h2</code>
                                    </div>
                                    <h2 className="font-mega text-mega-h2 uppercase">Creative Digital</h2>
                                </div>
                            </div>

                            {/* Standard Headers */}
                            <div className="space-y-24 border-b border-text/10 pb-32">
                                <div className="grid gap-32">
                                    {[
                                        { label: "H1", class: "font-heading text-h1", text: "The quick brown fox jumps" },
                                        { label: "H2", class: "font-heading text-h2", text: "The quick brown fox jumps" },
                                        { label: "H3", class: "font-heading text-h3", text: "The quick brown fox jumps over the lazy dog" },
                                        { label: "H4", class: "font-heading text-sm font-bold uppercase tracking-wider", text: "The quick brown fox jumps over the lazy dog" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-8">
                                            <div className="flex items-center gap-12">
                                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">{item.label}</span>
                                                <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">{item.class}</code>
                                            </div>
                                            <div className={item.class}>{item.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Body Text */}
                            <div className="space-y-24">
                                <div className="grid gap-32">
                                    {[
                                        { label: "Body Large", class: "font-text text-text-lg", text: "The quick brown fox jumps over the lazy dog. A clear and readable large text style." },
                                        { label: "Body Medium", class: "font-text text-text-md", text: "The quick brown fox jumps over the lazy dog. This is the standard body text used for most content paragraphs." },
                                        { label: "Body Small", class: "font-text text-text-sm", text: "The quick brown fox jumps over the lazy dog. Used for captions, labels, and secondary information." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-8">
                                            <div className="flex items-center gap-12">
                                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">{item.label}</span>
                                                <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">{item.class}</code>
                                            </div>
                                            <p className={item.class}>{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Spacing Section */}
                {activeTab === "spacing" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-32">
                            {[4, 8, 12, 16, 20, 24, 32, 48, 64].map((size) => (
                                <SpacingBlock key={size} size={String(size)} value={`${size}px`} />
                            ))}
                        </div>
                    </div>
                )}


                {/* Button Section */}
                {activeTab === "buttons" && (
                    <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-48">
                            {/* Variant: Filled */}
                            <div className="space-y-16">
                                <h3 className="font-heading text-h4 opacity-50 uppercase">Filled (Brand)</h3>
                                <div className="flex flex-wrap items-end gap-24">
                                    <ComponentBlock label="Filled / Large" classNameDisplay="size='large'">
                                        <Button size="large" rightIcon={ArrowRight}>Discuss a project</Button>
                                    </ComponentBlock>
                                    <ComponentBlock label="Filled / Medium" classNameDisplay="size='medium'">
                                        <Button size="medium" rightIcon={ArrowRight}>Discuss a project</Button>
                                    </ComponentBlock>
                                    <ComponentBlock label="Filled / Small" classNameDisplay="size='small'">
                                        <Button size="small" rightIcon={ArrowRight}>Discuss a project</Button>
                                    </ComponentBlock>
                                    <ComponentBlock label="Filled / Icon" classNameDisplay="leftIcon={Mail}">
                                        <Button size="medium" leftIcon={Mail}>Send Email</Button>
                                    </ComponentBlock>
                                </div>
                            </div>

                            {/* Variant: Outline */}
                            <div className="space-y-16">
                                <h3 className="font-heading text-h4 opacity-50 uppercase">Outline</h3>
                                <div className="flex flex-wrap items-end gap-24">
                                    <ComponentBlock label="Outline / Medium" classNameDisplay="variant='outline'">
                                        <Button variant="outline" size="medium" leftIcon={Plus}>Add Item</Button>
                                    </ComponentBlock>
                                    <ComponentBlock label="Outline / Small" classNameDisplay="variant='outline' size='small'">
                                        <Button variant="outline" size="small">No Icon</Button>
                                    </ComponentBlock>
                                </div>
                            </div>

                            {/* Variant: Disabled */}
                            <div className="space-y-16">
                                <h3 className="font-heading text-h4 opacity-50 uppercase">Disabled States</h3>
                                <div className="flex flex-wrap items-end gap-24">
                                    <ComponentBlock label="Filled / Disabled" classNameDisplay="disabled">
                                        <Button size="medium" disabled rightIcon={ArrowRight}>Button Locked</Button>
                                    </ComponentBlock>
                                    <ComponentBlock label="Outline / Disabled" classNameDisplay="variant='outline' disabled">
                                        <Button variant="outline" size="medium" disabled>Outline Locked</Button>
                                    </ComponentBlock>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inputs Section */}
                {activeTab === "inputs" && (
                    <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-64 max-w-[1200px]">
                            {/* Inputs */}
                            <div className="space-y-32">
                                <h3 className="font-heading text-h4 opacity-50 uppercase border-b border-text/10 pb-16">Text Inputs</h3>
                                <div className="grid gap-32">
                                    <ComponentBlock label="Large / Filled" classNameDisplay="sizeVariant='large'">
                                        <Input label="Company Name" placeholder="Enter company name..." sizeVariant="large" className="w-full" />
                                    </ComponentBlock>
                                    <ComponentBlock label="Default / Medium" classNameDisplay="sizeVariant='medium'">
                                        <Input label="Project Name" placeholder="Enter project name..." sizeVariant="medium" className="w-full" />
                                    </ComponentBlock>
                                    <ComponentBlock label="Default / Small" classNameDisplay="sizeVariant='small'">
                                        <Input label="Email" placeholder="your@email.com" sizeVariant="small" className="w-full" />
                                    </ComponentBlock>
                                    <ComponentBlock label="Error State" classNameDisplay="variant='error'">
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
                                    <ComponentBlock label="Large / Filled" classNameDisplay="sizeVariant='large'">
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
                                    <ComponentBlock label="Dropdown / Medium" classNameDisplay="sizeVariant='medium'">
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
                                    <ComponentBlock label="Dropdown / Error" classNameDisplay="variant='error'">
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
                )}

                {/* Tags Section */}
                {activeTab === "tags" && (
                    <div className="space-y-48 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-32">
                            <h3 className="font-heading text-h4 opacity-50 uppercase border-b border-text/10 pb-16">Tags</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
                                <ComponentBlock label="Brand Variant (Default)" classNameDisplay="variant='brand'">
                                    <div className="flex flex-wrap gap-8">
                                        <Tag variant="brand">React</Tag>
                                        <Tag variant="brand">TypeScript</Tag>
                                        <Tag variant="brand">Next.js</Tag>
                                        <Tag variant="brand">GSAP</Tag>
                                    </div>
                                </ComponentBlock>

                                <ComponentBlock label="Default Variant" classNameDisplay="variant='default'">
                                    <div className="flex flex-wrap gap-8">
                                        <Tag variant="default">Design</Tag>
                                        <Tag variant="default">Development</Tag>
                                        <Tag variant="default">Strategy</Tag>
                                        <Tag variant="default">Branding</Tag>
                                    </div>
                                </ComponentBlock>
                            </div>

                            <div className="bg-gray-50 p-24 rounded-xl border border-black/5">
                                <h4 className="font-heading text-sm font-bold mb-12 opacity-60">Usage</h4>
                                <code className="text-xs font-mono block mb-8">
                                    {'<Tag variant="brand">Label</Tag>'}
                                </code>
                                <code className="text-xs font-mono block">
                                    {'<Tag variant="default">Label</Tag>'}
                                </code>
                                <p className="text-xs opacity-60 mt-12">
                                    Brand variant uses --color-brand, default variant uses --color-text
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

