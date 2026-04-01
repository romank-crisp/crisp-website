import React from "react";
import { Tag } from "@/components/ui/Tag";
import { ComponentBlock } from "./ComponentBlock";

export function TagsSection() {
    return (
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
    );
}
