import React from "react";
import { ArrowRight } from "lucide-react";

export function TypographySection() {
    return (
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

                {/* Italic Formats */}
                <div className="space-y-24 mt-32 border-t border-text/10 pt-32">
                    <div className="grid gap-32">
                        {[
                            { label: "Default Italic (*text*)", class: "italic font-serif text-text px-1", text: "The quick brown fox jumps over the lazy dog." },
                            { label: "Animated Gradient White-Red (**text**)", class: "italic font-serif animate-gradient-text px-1 bg-[#180C2A] py-2", text: "The quick brown fox jumps over the lazy dog." },
                            { label: "Animated Gradient Dark-Red (***text***)", class: "italic font-serif animate-gradient-text-dark px-1", text: "The quick brown fox jumps over the lazy dog." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-8">
                                <div className="flex items-center gap-12">
                                    <span className="font-text text-sm opacity-40 uppercase tracking-widest">{item.label}</span>
                                    <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">
                                        {item.class.replace(" bg-[#180C2A] py-2", "") /* Remove bg helper from code display */}
                                    </code>
                                </div>
                                <p className="font-text text-text-lg">
                                    <em className={item.class}>{item.text}</em>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lists */}
                <div className="space-y-24 mt-32 border-t border-text/10 pt-32">
                    <div className="grid gap-32">
                        {/* Bulleted List */}
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-12 mb-4">
                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">Bulleted List (with Arrow)</span>
                                <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">ul li flex + ArrowRight</code>
                            </div>
                            <ul className="space-y-4 w-full md:w-[60%] border p-8 rounded-2xl border-gray-100">
                                <li className="flex items-start gap-4 w-full">
                                    <div className="shrink-0 mt-[9px]">
                                        <ArrowRight className="w-5 h-5 text-brand" />
                                    </div>
                                    <p className="font-text text-text-md text-text/70 leading-relaxed text-left m-0 flex-1">
                                        The quick brown fox jumps over the lazy dog. A clear and readable list item.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4 w-full">
                                    <div className="shrink-0 mt-[9px]">
                                        <ArrowRight className="w-5 h-5 text-brand" />
                                    </div>
                                    <p className="font-text text-text-md text-text/70 leading-relaxed text-left m-0 flex-1">
                                        Seamlessly integrate UI and UX components.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Numbered List */}
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-12 mb-4">
                                <span className="font-text text-sm opacity-40 uppercase tracking-widest">Numbered List</span>
                                <code className="text-xs font-mono text-brand bg-brand/5 px-6 py-2 rounded">ol list-decimal marker:text-brand marker:font-bold</code>
                            </div>
                            <div className="w-full md:w-[60%] border p-8 pl-12 rounded-2xl border-gray-100">
                                <ol className="list-decimal list-outside ml-[1.25rem] space-y-4 marker:text-brand marker:font-bold">
                                    <li className="pl-2">
                                        <p className="font-text text-text-md text-text/70 leading-relaxed m-0">
                                            First, the quick brown fox jumps over the lazy dog.
                                        </p>
                                    </li>
                                    <li className="pl-2">
                                        <p className="font-text text-text-md text-text/70 leading-relaxed m-0">
                                            Then, it proceeds to navigate the design system.
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
