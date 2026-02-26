"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ContactFormProvider } from "@/context/ContactFormContext";
import { BrandProvider } from "@/context/BrandContext";
import { BrandSwitcher } from "@/components/ui/BrandSwitcher";
import { ContactOverlay } from "@/components/forms/ContactOverlay";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer, FooterProps } from "@/components/layouts/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/layouts/SmoothScroll";
import { MenuItem } from "@/content/navigation";

import { PageTransition } from "@/components/layouts/PageTransition";
import { WorksPreloader } from "@/components/ui/WorksPreloader";
import { TransitionOverlay } from "@/components/layouts/TransitionOverlay";

export function GlobalLayout({ children, footerData, navigationData }: { children: React.ReactNode, footerData: FooterProps['data'], navigationData: MenuItem[] }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isDesignSystem = pathname?.startsWith('/design-system');
    const showSystemCursor = isAdmin || isDesignSystem;

    // Streamlined system cursor management
    useLayoutEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (showSystemCursor) {
            root.classList.add('system-cursor');
            body.classList.add('system-cursor');
            root.setAttribute('data-cursor-type', 'system');

            // Clear inline styles to let CSS take over
            root.style.cursor = '';
            body.style.cursor = '';
        } else {
            root.classList.remove('system-cursor');
            body.classList.remove('system-cursor');
            root.setAttribute('data-cursor-type', 'custom');

            // Force cursor hiding via inline style for maximum override
            root.style.setProperty('cursor', 'none', 'important');
            body.style.setProperty('cursor', 'none', 'important');
        }

        return () => {
            root.classList.remove('system-cursor');
            body.classList.remove('system-cursor');
            root.removeAttribute('data-cursor-type');
            root.style.cursor = '';
            body.style.cursor = '';
        };
    }, [showSystemCursor]);

    if (isAdmin) {
        return (
            <ContactFormProvider>
                <BrandProvider>
                    {children}
                </BrandProvider>
            </ContactFormProvider>
        );
    }

    return (
        <ContactFormProvider>
            <BrandProvider>
                <WorksPreloader />
                <TransitionOverlay />
                <CustomCursor />
                <ContactOverlay />
                <Navbar menuItems={navigationData} />
                <SmoothScroll>
                    <PageTransition>
                        {children}
                        <Footer data={footerData} />
                    </PageTransition>
                </SmoothScroll>
                <BrandSwitcher />
            </BrandProvider>
        </ContactFormProvider>
    );
}
