"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail, Plus } from "lucide-react";
import { ComponentBlock } from "./ComponentBlock";

export function ButtonsSection() {
    return (
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
    );
}
