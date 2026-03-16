"use client";

import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { getAssetUrl } from "@/lib/utils";

/* ─── Sections ──────────────────────────────────────────────────── */

const SECTIONS = [
    { label: "CMS", href: "/admin" },
    { label: "Design System", href: "/admin/design-system" },
    { label: "Patterns", href: "/admin/patterns" },
    { label: "Tools", href: "/admin/tools" },
] as const;

/* ─── Component ─────────────────────────────────────────────────── */

export function AdminTopNav() {
    const pathname = usePathname();
    const router = useRouter();

    const activeHref =
        SECTIONS.find((s) =>
            s.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(s.href)
        )?.href ?? "/admin";

    return (
        <header className="bg-white px-8 py-3 border-b border-gray-200 shrink-0">
            <div className="relative flex items-center h-full">
                {/* Brand */}
                <div className="flex items-center gap-4 z-10">
                    <img
                        src={getAssetUrl("/img/crisp-logo.svg")}
                        alt="crisp logo"
                        width={80}
                        height={32}
                        className="select-none"
                    />
                    <span className="text-gray-200 text-xl font-light select-none">|</span>
                    <span className="text-brand font-heading text-xl font-bold tracking-tight select-none">
                        Admin
                    </span>
                </div>

                {/* Navigation - Centered absolute */}
                <nav className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-12 pointer-events-auto">
                        {SECTIONS.map((section) => {
                            const isActive = activeHref === section.href;
                            return (
                                <button
                                    key={section.href}
                                    onClick={() => router.push(section.href)}
                                    className={clsx(
                                        "text-sm font-text transition-all duration-200 text-black px-4 py-3",
                                        isActive
                                            ? "opacity-100 font-semibold"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </header>
    );
}
