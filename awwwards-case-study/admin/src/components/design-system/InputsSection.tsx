"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { ComponentBlock } from "./ComponentBlock";

export function InputsSection() {
    return (
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
    );
}
